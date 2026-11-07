import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '..');
const cssPath = path.join(projectRoot, 'app', 'platform-remix.css');
const topbarPath = path.join(projectRoot, 'components', 'StudentTopbar.tsx');
const readingCompanionPath = path.join(projectRoot, 'components', 'ReadingCompanion.tsx');

test('Student menu popover has scrollable bounded height and custom scrollbar in CSS', () => {
  const css = fs.readFileSync(cssPath, 'utf8');

  // Verify desktop popover scrolling properties
  assert.match(
    css,
    /\.student-account-popover\s*\{[^}]*max-height:\s*min\(calc\(100dvh\s*-\s*110px\),\s*520px\)/,
    'Popover must have max-height constraint for viewport bounds'
  );
  assert.match(
    css,
    /\.student-account-popover\s*\{[^}]*overflow-y:\s*auto/,
    'Popover must have overflow-y: auto for scrolling'
  );
  assert.match(
    css,
    /\.student-account-popover\s*\{[^}]*overscroll-behavior:\s*contain/,
    'Popover must have overscroll-behavior: contain to prevent background scroll chaining'
  );
  assert.match(
    css,
    /\.student-account-popover\s*\{[^}]*-webkit-overflow-scrolling:\s*touch/,
    'Popover must have smooth iOS momentum touch scrolling'
  );

  // Verify custom scrollbar styling
  assert.match(
    css,
    /\.student-account-popover::-webkit-scrollbar/,
    'Popover must have webkit scrollbar styling'
  );
  assert.match(
    css,
    /\.student-account-popover::-webkit-scrollbar-thumb/,
    'Popover must have thumb scrollbar styling'
  );

  // Verify mobile popover constraint
  assert.match(
    css,
    /\.student-account-popover\s*\{[^}]*max-height:\s*calc\(100dvh\s*-\s*145px\)/,
    'Mobile popover must have max-height constraint above bottom nav'
  );
});

test('StudentTopbar implements click-outside collapse, Escape key, and route collapse', () => {
  const topbar = fs.readFileSync(topbarPath, 'utf8');

  // Must be client component
  assert.ok(
    topbar.startsWith("'use client';") || topbar.startsWith('"use client";'),
    'StudentTopbar must be a client component'
  );

  // Must manage menuOpen state and ref
  assert.match(
    topbar,
    /const\s*\[menuOpen,\s*setMenuOpen\]\s*=\s*useState\(false\)/,
    'Must declare menuOpen state'
  );
  assert.match(
    topbar,
    /const\s*menuRef\s*=\s*useRef<HTMLDetailsElement>\(null\)/,
    'Must declare menuRef for click-outside detection'
  );

  // Must collapse on pathname change
  assert.match(
    topbar,
    /setMenuOpen\(false\);\s*\}\s*,\s*\[pathname\]\)/,
    'Must collapse menu on route navigation'
  );

  // Must handle pointerdown for click outside
  assert.match(
    topbar,
    /document\.addEventListener\(['"]pointerdown['"],\s*handlePointerDown\)/,
    'Must listen for pointerdown on document'
  );
  assert.match(
    topbar,
    /!menuRef\.current\.contains\(event\.target\s*as\s*Node\)/,
    'Must check if pointerdown target is outside menuRef'
  );

  // Must handle Escape key
  assert.match(
    topbar,
    /event\.key\s*===\s*['"]Escape['"]/,
    'Must detect Escape key to collapse menu'
  );

  // Must handle link/button clicks inside popover
  assert.match(
    topbar,
    /target\.closest\(['"]a['"]\)\s*\|\|\s*target\.closest\(['"]button['"]\)/,
    'Must collapse menu when an option link or button is clicked'
  );

  // Must have aria-expanded for screen-reader accessibility
  assert.match(
    topbar,
    /aria-expanded=\{menuOpen\}/,
    'Must declare aria-expanded attribute on summary'
  );
});

test('ReadingCompanion contents menu collapses on outside click, Escape, and selection', () => {
  const reading = fs.readFileSync(readingCompanionPath, 'utf8');

  assert.match(
    reading,
    /const\s*contentsRef\s*=\s*useRef<HTMLDetailsElement>\(null\)/,
    'ReadingCompanion must have contentsRef'
  );
  assert.match(
    reading,
    /const\s*\[contentsOpen,\s*setContentsOpen\]\s*=\s*useState\(false\)/,
    'ReadingCompanion must track contentsOpen state'
  );
  assert.match(
    reading,
    /document\.addEventListener\(['"]pointerdown['"],\s*handlePointerDown\)/,
    'ReadingCompanion must listen for pointerdown outside'
  );
  assert.match(
    reading,
    /setContentsOpen\(false\)/,
    'ReadingCompanion must collapse on selection'
  );
});
