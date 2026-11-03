// @vitest-environment happy-dom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  PhotoCredit,
  parseAttribution,
} from '../../src/components/PhotoCredit';

const licenceBoxes = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll('.lic')).map(
    (node) => node.textContent ?? ''
  );

describe('parseAttribution', () => {
  it('splits a some-rights-reserved credit into name and licence', () => {
    expect(
      parseAttribution(
        '(c) Jane Doe, some rights reserved (CC BY-NC), uploaded by jdoe'
      )
    ).toEqual({ kind: 'licensed', name: 'Jane Doe', licence: 'CC BY-NC' });
  });

  it('marks all rights reserved, and no rights reserved', () => {
    expect(
      parseAttribution('(c) Jane Doe, all rights reserved, uploaded by jdoe')
    ).toEqual({ kind: 'reserved', name: 'Jane Doe' });
    expect(parseAttribution('no rights reserved (CC0)')).toEqual({
      kind: 'public-domain',
      licence: 'CC0',
    });
  });

  it('returns unknown strings verbatim', () => {
    expect(parseAttribution('Photo by someone')).toEqual({
      kind: 'verbatim',
      text: 'Photo by someone',
    });
  });
});

describe('PhotoCredit', () => {
  it('shows the PHOTO caption, the photographer and a licence box', () => {
    const { container } = render(
      <PhotoCredit attribution="(c) Jane Doe, some rights reserved (CC BY-NC), uploaded by jdoe" />
    );
    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('© Jane Doe')).toBeInTheDocument();
    expect(licenceBoxes(container)).toEqual(['CC BY-NC']);
    expect(container).not.toHaveTextContent('uploaded');
  });

  it('prints All rights reserved as plain text, not in a licence box', () => {
    const { container } = render(
      <PhotoCredit attribution="(c) 航一帆, all rights reserved" />
    );
    expect(screen.getByText('© 航一帆')).toBeInTheDocument();
    expect(screen.getByText('All rights reserved')).toBeInTheDocument();
    expect(licenceBoxes(container)).toEqual([]);
  });

  it('shows the whole credit untruncated, even a very long name', () => {
    const name = 'A Very Long Photographer Name '.repeat(6).trim();
    render(
      <PhotoCredit attribution={`(c) ${name}, some rights reserved (CC BY)`} />
    );
    expect(screen.getByText(`© ${name}`)).toBeInTheDocument();
  });

  it('full variant prints the complete string minus the uploader', () => {
    render(
      <PhotoCredit
        variant="full"
        attribution="(c) Jane Doe, some rights reserved (CC BY-NC), uploaded by jdoe"
      />
    );
    expect(
      screen.getByText('(c) Jane Doe, some rights reserved (CC BY-NC)')
    ).toBeInTheDocument();
  });

  it('renders nothing without an attribution (no credit, no photo)', () => {
    const { container } = render(<PhotoCredit attribution="  " />);
    expect(container).toBeEmptyDOMElement();
  });
});
