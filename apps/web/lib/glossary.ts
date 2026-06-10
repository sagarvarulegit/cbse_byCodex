import { type GlossaryPayload } from '../components/GlossaryTerm';

export const GLOSSARY: Record<string, GlossaryPayload> = {
  'real number': {
    term: 'Real number',
    shortMeaning: 'Any number that can be shown on the number line.',
    example: '-3, 0, 5/8, √2',
  },
  'real numbers': {
    term: 'Real numbers',
    shortMeaning: 'All numbers that fit somewhere on the number line.',
    example: '-3, 0, 5/8, √2',
  },
  lemma: {
    term: 'Lemma',
    shortMeaning: 'A small helpful rule used to prove or solve a bigger result.',
    example: 'Here it is the rule a = bq + r.',
  },
  dividend: {
    term: 'Dividend',
    shortMeaning: 'The number that is being divided.',
    example: 'In 17 ÷ 5, the dividend is 17.',
  },
  divisor: {
    term: 'Divisor',
    shortMeaning: 'The number by which we divide.',
    example: 'In 17 ÷ 5, the divisor is 5.',
  },
  quotient: {
    term: 'Quotient',
    shortMeaning: 'The answer we get before the remainder.',
    example: 'In 17 ÷ 5, the quotient is 3.',
  },
  remainder: {
    term: 'Remainder',
    shortMeaning: 'The part left after division.',
    example: 'In 17 ÷ 5, the remainder is 2.',
  },
  factor: {
    term: 'Factor',
    shortMeaning: 'A number that divides another number exactly.',
    example: '3 is a factor of 12 because 12 ÷ 3 = 4.',
  },
  factors: {
    term: 'Factors',
    shortMeaning: 'Numbers that divide a given number exactly.',
    example: 'Factors of 12 are 1, 2, 3, 4, 6, 12.',
  },
  factorisation: {
    term: 'Factorisation',
    shortMeaning: 'Breaking a number into smaller multiplying parts.',
    example: '12 = 2 × 2 × 3',
  },
  factorise: {
    term: 'Factorise',
    shortMeaning: 'To break a number into factors.',
    example: 'Factorise 12 as 2 × 2 × 3.',
  },
  factorising: {
    term: 'Factorising',
    shortMeaning: 'Breaking a number into factors step by step.',
    example: 'Factorising 40 gives 2³ × 5.',
  },
  'prime factor': {
    term: 'Prime factor',
    shortMeaning: 'A factor that is also a prime number.',
    example: '2 and 3 are prime factors of 12.',
  },
  'prime factors': {
    term: 'Prime factors',
    shortMeaning: 'Factors that are themselves prime numbers.',
    example: 'Prime factors of 12 are 2, 2, 3.',
  },
  'prime factorisation': {
    term: 'Prime factorisation',
    shortMeaning: 'Breaking a number until only prime numbers are left.',
    example: '12 = 2 × 2 × 3',
  },
  'prime number': {
    term: 'Prime number',
    shortMeaning: 'A number with exactly two factors: 1 and itself.',
    example: '2, 3, 5, 7',
  },
  'prime numbers': {
    term: 'Prime numbers',
    shortMeaning: 'Numbers with exactly two factors: 1 and themselves.',
    example: '2, 3, 5, 7',
  },
  prime: {
    term: 'Prime',
    shortMeaning: 'A number that has exactly two factors.',
    example: '5 is prime.',
  },
  primes: {
    term: 'Primes',
    shortMeaning: 'Prime numbers used in plural form.',
    example: '2, 3, 5, 7 are primes.',
  },
  'composite number': {
    term: 'Composite number',
    shortMeaning: 'A number with more than two factors.',
    example: '4, 6, 8, 9',
  },
  'composite numbers': {
    term: 'Composite numbers',
    shortMeaning: 'Numbers with more than two factors.',
    example: '4, 6, 8, 9',
  },
  hcf: {
    term: 'HCF',
    shortMeaning: 'Highest Common Factor: the biggest common factor of the given numbers.',
    example: 'HCF of 12 and 18 is 6.',
  },
  lcm: {
    term: 'LCM',
    shortMeaning: 'Lowest Common Multiple: the smallest common multiple of the given numbers.',
    example: 'LCM of 6 and 8 is 24.',
  },
  multiple: {
    term: 'Multiple',
    shortMeaning: 'A number we get by multiplying a given number by 1, 2, 3 and so on.',
    example: 'Multiples of 5 are 5, 10, 15, 20.',
  },
  multiples: {
    term: 'Multiples',
    shortMeaning: 'Numbers made by multiplying a given number by whole numbers.',
    example: 'Multiples of 4 are 4, 8, 12, 16.',
  },
  divisible: {
    term: 'Divisible',
    shortMeaning: 'A number is divisible by another when the remainder is 0.',
    example: '18 is divisible by 3.',
  },
  'rational number': {
    term: 'Rational number',
    shortMeaning: 'A number that can be written in the form p/q where q is not 0.',
    example: '3/4, -7/5, 2, 0.125',
  },
  'rational numbers': {
    term: 'Rational numbers',
    shortMeaning: 'Numbers that can be written in the form p/q where q is not 0.',
    example: '3/4, -7/5, 2, 0.125',
  },
  'irrational number': {
    term: 'Irrational number',
    shortMeaning: 'A number that cannot be written in the form p/q.',
    example: '√2, √3, π',
  },
  'irrational numbers': {
    term: 'Irrational numbers',
    shortMeaning: 'Numbers that cannot be written in the form p/q.',
    example: '√2, √3, π',
  },
  contradiction: {
    term: 'Contradiction',
    shortMeaning: 'A result that clashes with our starting assumption, so the assumption must be wrong.',
    example: 'If a and b are in lowest form but both become even, that is a contradiction.',
  },
  'lowest form': {
    term: 'Lowest form',
    shortMeaning: 'A fraction whose numerator and denominator have no common factor except 1.',
    example: '2/5 is the lowest form of 6/15.',
  },
  'terminating decimal': {
    term: 'Terminating decimal',
    shortMeaning: 'A decimal that ends after a finite number of digits.',
    example: '0.325',
  },
  'repeating decimal': {
    term: 'Repeating decimal',
    shortMeaning: 'A decimal whose digits repeat in a fixed pattern forever.',
    example: '0.3333...',
  },
};
