import assert from 'node:assert/strict';
import test from 'node:test';
import { Server } from 'node:http';
import app from './app.js';

test('GET /health returns 200 ok', async () => {
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/health`);
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.deepEqual(data, { status: 'ok', service: 'cbse-api' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /v1/catalog/pilot returns DB subjects and chapters', async () => {
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/v1/catalog/pilot`);
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.equal(data.classLevel, 10);
    assert.ok(Array.isArray(data.subjects));

    // We expect Mathematics and Science pilot subjects and chapters to be returned
    const math = data.subjects.find((s: any) => s.name === 'Mathematics');
    assert.ok(math);
    assert.ok(math.chapters.some((c: any) => c.title === 'Real Numbers' && c.accessLevel === 'free-preview'));

    const science = data.subjects.find((s: any) => s.name === 'Science');
    assert.ok(science);
    assert.ok(science.chapters.some((c: any) => c.title === 'Chemical Reactions and Equations' && c.accessLevel === 'free-preview'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
