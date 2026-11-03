import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from '../../src/lib/sanitize';

describe('sanitizeHtml', () => {
  it('drops script elements with their content', () => {
    expect(sanitizeHtml('a<script>alert(1)</script>b')).toBe('ab');
    expect(sanitizeHtml('a<SCRIPT src=x>evil()</SCRIPT >b')).toBe('ab');
  });

  it('drops event handler attributes', () => {
    expect(sanitizeHtml('<p onclick="x()">hi</p>')).toBe('<p>hi</p>');
    expect(sanitizeHtml('<img src=x onerror=alert(1)>text')).toBe('text');
    expect(sanitizeHtml('<b onmouseover="x">b</b>')).toBe('<b>b</b>');
  });

  it('drops javascript: and other non-allowlisted hrefs, keeping the text', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">go</a>')).toBe('go');
    expect(sanitizeHtml('<a href="JaVaScRiPt:alert(1)">go</a>')).toBe('go');
    expect(sanitizeHtml('<a href="&#106;avascript:alert(1)">go</a>')).toBe(
      'go'
    );
    expect(sanitizeHtml('<a href="https://evil.example/">go</a>')).toBe('go');
    expect(
      sanitizeHtml('<a href="https://en.wikipedia.org@evil.example/">go</a>')
    ).toBe('go');
    expect(sanitizeHtml('<a href="http://en.wikipedia.org/x">go</a>')).toBe(
      'go'
    );
  });

  it('drops iframe and style including their content', () => {
    expect(sanitizeHtml('x<iframe src="https://e.example">t</iframe>y')).toBe(
      'xy'
    );
    expect(sanitizeHtml('x<style>p{color:red}</style>y')).toBe('xy');
  });

  it('closes unclosed tags and never leaks a dangling tag opener', () => {
    expect(sanitizeHtml('<p><b>bold')).toBe('<p><b>bold</b></p>');
    expect(sanitizeHtml('text <a href="https://en.wikipedia.org/x')).toBe(
      'text &lt;a href=&quot;https://en.wikipedia.org/x'
    );
    expect(sanitizeHtml('<script>never closed')).toBe('');
  });

  it('keeps allowed tags and wikipedia https links with rel', () => {
    expect(
      sanitizeHtml(
        'The <b>milky stork</b> (<i>Mycteria cinerea</i>)<br>is <em>a</em> <strong>bird</strong>.'
      )
    ).toBe(
      'The <b>milky stork</b> (<i>Mycteria cinerea</i>)<br>is <em>a</em> <strong>bird</strong>.'
    );
    expect(
      sanitizeHtml(
        '<a href="https://en.wikipedia.org/wiki/Stork?a=1&amp;b=2" target="_blank" onclick="x()">Stork</a>'
      )
    ).toBe(
      '<a href="https://en.wikipedia.org/wiki/Stork?a=1&amp;b=2" rel="noopener noreferrer">Stork</a>'
    );
  });

  it('drops other tags but keeps their text, and stays entity-safe', () => {
    expect(sanitizeHtml('<div><span>Tom &amp; Jerry</span></div>')).toBe(
      'Tom &amp; Jerry'
    );
    expect(sanitizeHtml('1 < 2 & 3 > 2')).toBe('1 &lt; 2 &amp; 3 &gt; 2');
    expect(sanitizeHtml('&lt;script&gt;x&lt;/script&gt;')).toBe(
      '&lt;script&gt;x&lt;/script&gt;'
    );
  });

  it('closes tags in order when a stray closer appears', () => {
    expect(sanitizeHtml('<b>one</i>two</b>')).toBe('<b>onetwo</b>');
  });
});
