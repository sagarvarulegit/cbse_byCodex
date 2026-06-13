import 'dotenv/config';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type CliOptions = {
  outDir?: string;
  script?: string;
};

type Alignment = {
  characters?: string[];
  character_start_times_seconds?: number[];
  character_end_times_seconds?: number[];
};

type WordCaption = {
  end: number;
  id: string;
  start: number;
  text: string;
};

const DEFAULT_VOICE_ID = 'g14YnDYCsy3k7XLlcKlO';
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2';
const DEFAULT_OUTPUT_FORMAT = 'mp3_44100_128';
const DEFAULT_SPEED = 0.85;

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    switch (arg) {
      case '--out-dir':
        options.outDir = next;
        index += 1;
        break;
      case '--script':
        options.script = next;
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printUsage() {
  console.error(`Usage:
  npm run elevenlabs:voiceover -w apps/api -- --script ./videos/class-10/mathematics/real-numbers/01-euclid-division-lemma/source/script.md --out-dir ./videos/class-10/mathematics/real-numbers/01-euclid-division-lemma

Required env:
  ELEVENLABS_API_KEY

Optional env:
  ELEVENLABS_VOICE_ID
  ELEVENLABS_MODEL_ID
  ELEVENLABS_OUTPUT_FORMAT
  ELEVENLABS_SPEED
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.script) {
    throw new Error('--script is required.');
  }

  if (!options.outDir) {
    throw new Error('--out-dir is required.');
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ELEVENLABS_API_KEY.');
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_MODEL_ID;
  const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT ?? DEFAULT_OUTPUT_FORMAT;
  const speed = Number(process.env.ELEVENLABS_SPEED ?? DEFAULT_SPEED);

  if (!Number.isFinite(speed) || speed <= 0) {
    throw new Error('ELEVENLABS_SPEED must be a positive number.');
  }

  const scriptPath = path.resolve(options.script);
  const outDir = path.resolve(options.outDir);
  const narrationDir = path.join(outDir, 'narration');
  const captionsDir = path.join(outDir, 'captions');
  const text = await readFile(scriptPath, 'utf8');
  const url = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`);
  url.searchParams.set('output_format', outputFormat);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.25,
        speed,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs request failed: ${response.status} ${response.statusText}\n${body}`);
  }

  const result = await response.json() as {
    alignment?: Alignment;
    audio_base64?: string;
    normalized_alignment?: Alignment;
  };

  const audioBase64 = result.audio_base64;
  const alignment = result.normalized_alignment ?? result.alignment;
  if (!audioBase64 || !alignment) {
    throw new Error('ElevenLabs response did not include audio_base64 and alignment data.');
  }

  const words = toWordCaptions(alignment);

  await mkdir(narrationDir, { recursive: true });
  await mkdir(captionsDir, { recursive: true });
  await writeFile(path.join(narrationDir, 'narration.mp3'), Buffer.from(audioBase64, 'base64'));
  await writeFile(path.join(narrationDir, 'elevenlabs-alignment.json'), JSON.stringify(alignment, null, 2));
  await writeFile(
    path.join(narrationDir, 'voice-settings.json'),
    JSON.stringify({ modelId, outputFormat, speed, voiceId }, null, 2),
  );
  await writeFile(path.join(captionsDir, 'word-captions.json'), JSON.stringify(words, null, 2));
  await writeFile(path.join(captionsDir, 'captions.vtt'), toWebVtt(words));

  console.log(`Generated ${path.join(narrationDir, 'narration.mp3')}`);
  console.log(`Generated ${path.join(captionsDir, 'word-captions.json')}`);
  console.log(`Generated ${path.join(captionsDir, 'captions.vtt')}`);
}

function toWordCaptions(alignment: Alignment): WordCaption[] {
  const characters = alignment.characters ?? [];
  const starts = alignment.character_start_times_seconds ?? [];
  const ends = alignment.character_end_times_seconds ?? [];
  const words: Omit<WordCaption, 'id'>[] = [];
  let current: Omit<WordCaption, 'id'> | null = null;

  for (let index = 0; index < characters.length; index += 1) {
    const char = characters[index] ?? '';
    const isSpace = /\s/.test(char);

    if (isSpace) {
      if (current) {
        words.push(current);
        current = null;
      }
      continue;
    }

    if (!current) {
      current = {
        text: char,
        start: starts[index] ?? 0,
        end: ends[index] ?? starts[index] ?? 0,
      };
      continue;
    }

    current.text += char;
    current.end = ends[index] ?? current.end;
  }

  if (current) {
    words.push(current);
  }

  return words.map((word, index) => ({
    id: `w${index}`,
    text: word.text,
    start: Number(word.start.toFixed(3)),
    end: Number(word.end.toFixed(3)),
  }));
}

function toWebVtt(words: WordCaption[]): string {
  const cues = groupCaptionCues(words);
  const lines = ['WEBVTT', ''];

  cues.forEach((cue, index) => {
    lines.push(String(index + 1));
    lines.push(`${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}`);
    lines.push(cue.text);
    lines.push('');
  });

  return lines.join('\n');
}

function groupCaptionCues(words: WordCaption[]) {
  const cues: Array<{ end: number; start: number; text: string }> = [];
  const maxWords = 7;
  const maxDurationSeconds = 4;

  for (let index = 0; index < words.length; index += maxWords) {
    const first = words[index];
    if (!first) {
      continue;
    }

    let chunk = words.slice(index, index + maxWords);
    while (chunk.length > 1 && chunk[chunk.length - 1].end - first.start > maxDurationSeconds) {
      chunk = chunk.slice(0, -1);
    }

    const last = chunk[chunk.length - 1];
    cues.push({
      start: first.start,
      end: last.end,
      text: chunk.map((word) => word.text).join(' '),
    });

    index += chunk.length - maxWords;
  }

  return cues;
}

function formatVttTime(seconds: number) {
  const totalMilliseconds = Math.max(0, Math.round(seconds * 1000));
  const milliseconds = totalMilliseconds % 1000;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const secondsPart = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${pad(hours)}:${pad(minutes)}:${pad(secondsPart)}.${String(milliseconds).padStart(3, '0')}`;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

main().catch((error) => {
  printUsage();
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
