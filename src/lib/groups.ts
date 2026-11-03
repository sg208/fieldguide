export const ICONIC_TAXA = [
  'Aves',
  'Plantae',
  'Insecta',
  'Mammalia',
  'Reptilia',
  'Amphibia',
  'Actinopterygii',
  'Fungi',
  'Mollusca',
  'Arachnida',
] as const;

export type IconicTaxon = (typeof ICONIC_TAXA)[number];

export const GROUPS = [
  { key: 'all', label: 'All', iconicTaxon: undefined },
  { key: 'birds', label: 'Birds', iconicTaxon: 'Aves' },
  { key: 'plants', label: 'Plants', iconicTaxon: 'Plantae' },
  { key: 'insects', label: 'Insects', iconicTaxon: 'Insecta' },
  { key: 'mammals', label: 'Mammals', iconicTaxon: 'Mammalia' },
  { key: 'reptiles', label: 'Reptiles', iconicTaxon: 'Reptilia' },
  { key: 'amphibians', label: 'Amphibians', iconicTaxon: 'Amphibia' },
  { key: 'fish', label: 'Fish', iconicTaxon: 'Actinopterygii' },
  { key: 'fungi', label: 'Fungi', iconicTaxon: 'Fungi' },
  { key: 'mollusks', label: 'Mollusks', iconicTaxon: 'Mollusca' },
  { key: 'arachnids', label: 'Arachnids', iconicTaxon: 'Arachnida' },
] as const;

export type GroupKey = (typeof GROUPS)[number]['key'];

export const DEFAULT_GROUP: GroupKey = 'all';

export const groupToIconicTaxa = (
  group: GroupKey
): IconicTaxon[] | undefined => {
  const iconicTaxon = GROUPS.find((entry) => entry.key === group)?.iconicTaxon;
  return iconicTaxon ? [iconicTaxon] : undefined;
};
