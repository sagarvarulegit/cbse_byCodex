---
title: Real Numbers
audience: CBSE Class 10
subject: Mathematics
chapter_number: 1
chapter_slug: real-numbers
status: draft
content_type: chapter-pack
curriculum_scope_note: Euclid division algorithm and decimal expansions are support-only,
  not 2026-27 board topics
type: ChapterPack
description: Class 10 CBSE notes for Real Numbers.
tags:
- cbse
- class-10
- real-numbers
timestamp: '2026-07-08T12:00:00Z'
---
# Real Numbers

> 2026-27 curriculum scope: the Fundamental Theorem of Arithmetic and irrationality proofs are board-exam topics. Euclid's division algorithm and decimal-expansion material remain support resources and must not be counted as board coverage.

This is an original teaching draft for Class 10 Mathematics, Chapter 1. The language is kept very simple on purpose. The goal is not to sound fancy. The goal is to make the student understand.

## chapter goal

By the end of this chapter, a student should be able to:
- understand what real numbers are
- break a number into prime factors
- use prime factorisation to find HCF and LCM
- understand why some numbers are irrational
- avoid common mistakes in board questions

## teacher note on textbook alignment

The current NCERT Class 10 chapter text strongly focuses on:
- prime factorisation
- the Fundamental Theorem of Arithmetic
- HCF and LCM applications
- irrational numbers

The product also keeps support lessons on Euclid division lemma and decimal expansion of rational numbers. They fit the learning journey, but the 2026-27 registry classifies them as excluded from board-exam scope.

## chapter flow for the platform

1. Number families refresher
2. Prime numbers and prime factorisation
3. Fundamental Theorem of Arithmetic
4. HCF and LCM by prime factorisation
5. Irrational numbers
6. Support lesson: Euclid division lemma
7. Support lesson: decimal expansion of rational numbers
8. Quick revision and practice

## 1) number families refresher

Before starting the chapter, students should know the basic number families.

### natural numbers
Counting numbers:
`1, 2, 3, 4, 5, ...`

### whole numbers
Natural numbers with zero:
`0, 1, 2, 3, 4, 5, ...`

### integers
Positive numbers, negative numbers, and zero:
`..., -3, -2, -1, 0, 1, 2, 3, ...`

### rational numbers
A number is rational if it can be written as `p/q`, where `q` is not zero.

Examples:
- `3/4`
- `-5/2`
- `7` because `7 = 7/1`
- `0.25 = 25/100 = 1/4`

### irrational numbers
A number is irrational if it cannot be written exactly in the form `p/q`.

Examples:
- `√2`
- `√3`
- `π`

### real numbers
All rational numbers and all irrational numbers together are called real numbers.

### easy memory line
Real numbers = everything you normally place on the number line.

## 2) prime numbers and prime factorisation

### prime numbers
A prime number has exactly two factors: `1` and the number itself.

Examples:
- `2, 3, 5, 7, 11, 13`

### composite numbers
A composite number has more than two factors.

Examples:
- `4, 6, 8, 9, 10, 12`

### important note
`1` is neither prime nor composite.

### prime factorisation
Prime factorisation means writing a number as a product of prime numbers.

Think like this:
A big number is a building. Prime numbers are the bricks.

### examples
`140 = 2 × 2 × 5 × 7 = 2² × 5 × 7`

`156 = 2 × 2 × 3 × 13 = 2² × 3 × 13`

`525 = 3 × 5 × 5 × 7 = 3 × 5² × 7`

### how to do prime factorisation
1. Start dividing by the smallest prime number.
2. Keep dividing until it no longer works.
3. Move to the next prime number.
4. Stop when only a prime number is left.

### trick to remember
Always try this order first:
`2, 3, 5, 7, 11, ...`

## 3) Fundamental Theorem of Arithmetic

### statement in easy English
Every composite number can be written as a product of prime numbers.
This prime factor form is unique, except for the order.

That means:
`60 = 2 × 2 × 3 × 5`

You may write it in another order:
`60 = 5 × 3 × 2 × 2`

But the prime factors are still the same.

### why this matters
This idea helps us:
- understand numbers better
- find HCF
- find LCM
- prove some results about irrational numbers

### how to remember it
One number has one prime fingerprint.

That is a very good memory line for students.

## 4) HCF and LCM by prime factorisation

### HCF meaning
HCF means Highest Common Factor.
It is the biggest number that divides both numbers exactly.

### LCM meaning
LCM means Lowest Common Multiple.
It is the smallest number that both numbers can divide exactly.

### golden rule
- HCF takes only the common prime factors with the smallest powers.
- LCM takes all prime factors with the greatest powers.

### solved example 1
Find the HCF and LCM of `26` and `91`.

Prime factor forms:
- `26 = 2 × 13`
- `91 = 7 × 13`

Common prime factor is only `13`.

So,
- `HCF = 13`
- `LCM = 2 × 7 × 13 = 182`

### solved example 2
Find the HCF and LCM of `135` and `225`.

Prime factor forms:
- `135 = 3³ × 5`
- `225 = 3² × 5²`

For HCF, take common primes with smaller powers:
- `HCF = 3² × 5 = 45`

For LCM, take all primes with bigger powers:
- `LCM = 3³ × 5² = 675`

### check rule
For two numbers only:
`HCF × LCM = product of the two numbers`

Here:
`45 × 675 = 30375`
`135 × 225 = 30375`

So the answer is correct.

### quick memory trick
- HCF hugs the overlap.
- LCM loads everything.

Students remember this fast.

## 5) irrational numbers

### simple meaning
An irrational number cannot be written exactly as `p/q`.

Its decimal form:
- does not end
- does not repeat in a fixed pattern

### examples
- `√2`
- `√3`
- `√5`

### important warning
Do not say a number is irrational just because the decimal is long.
The reason must be mathematical, not visual.

For example:
- `0.3333...` is rational because it repeats and equals `1/3`
- `√2` is irrational because it cannot be written as `p/q`

### proof idea of `√2` in very easy English
We assume `√2` is rational.
So let:
`√2 = a/b`
where `a` and `b` have no common factor.

Now square both sides:
`2 = a²/b²`
So,
`a² = 2b²`

That means `a²` is even, so `a` must also be even.
If `a` is even, write `a = 2k`.

Put that back:
`(2k)² = 2b²`
`4k² = 2b²`
`2k² = b²`

Now `b²` is also even, so `b` is even.

So both `a` and `b` are even.
That means both have a common factor `2`.
But we already said `a` and `b` had no common factor.
This is a contradiction.

So our first assumption was wrong.
Therefore, `√2` is irrational.

### what students should actually remember
In board writing, the flow matters:
1. Assume `√2 = a/b` in lowest form.
2. Show `a` is even.
3. Show `b` is even.
4. Contradiction.
5. Hence `√2` is irrational.

### memory trick
If both numerator and denominator become even, the assumption breaks.

## 6) support lesson: Euclid division lemma

This is a very useful support topic for HCF.

### statement in easy English
When one positive integer `a` is divided by another positive integer `b`, we can write:

`a = bq + r`

where:
- `q` is quotient
- `r` is remainder
- `0 ≤ r < b`

### meaning in plain words
Big number = divisor × quotient + what is left

### example
Divide `455` by `42`.

`455 = 42 × 10 + 35`

Here:
- quotient = `10`
- remainder = `35`

### using Euclid method to find HCF of 455 and 42
`455 = 42 × 10 + 35`
`42 = 35 × 1 + 7`
`35 = 7 × 5 + 0`

When remainder becomes zero, the last divisor is the HCF.

So,
`HCF(455, 42) = 7`

### memory trick
Keep dividing. Stop when remainder becomes zero. Last divisor is the answer.

## 7) support lesson: decimal expansion of rational numbers

This topic helps students connect fractions and decimals.

### core idea
A rational number can have:
- a terminating decimal
- or a non-terminating repeating decimal

### examples
- `13/40 = 0.325` which is terminating
- `29/125 = 0.232` which is terminating
- `7/12 = 0.58333...` which is non-terminating repeating

### important rule
Write the fraction in lowest form first.
Then check the denominator.

If the denominator has only prime factors `2` and/or `5`, the decimal will terminate.

If the denominator has any prime factor other than `2` or `5`, the decimal will not terminate. It will repeat.

### why this happens
Our decimal system is based on `10`.
And `10 = 2 × 5`.
So denominators built only from `2` and `5` fit neatly into decimal form.

### memory trick
`2` and `5` are friends of base 10.

### example check
`13/40`

First factorise denominator:
`40 = 2³ × 5`
Only `2` and `5` are present.
So decimal terminates.

`7/12`

Factorise denominator:
`12 = 2² × 3`
There is a `3`.
So decimal will not terminate. It will repeat.

## 8) exam-friendly summary notes

### must-know facts
- Every composite number has a unique prime factorisation.
- HCF uses smallest powers of common prime factors.
- LCM uses greatest powers of all prime factors.
- `√2`, `√3`, `√5` are irrational.
- A decimal terminates only when the denominator in lowest form has only `2` and/or `5`.

### one-line revision points
- Prime factorisation = break into prime bricks.
- HCF = common part.
- LCM = full part.
- Irrational = cannot be written as `p/q`.
- Terminating decimal = denominator has only `2` and `5`.

## 9) common mistakes students make

1. Treating `1` as a prime number.
2. Forgetting to write the fraction in lowest form before checking decimal expansion.
3. Taking bigger powers in HCF instead of smaller powers.
4. Thinking every long decimal is irrational.
5. Writing the `√2` proof without saying that `a/b` is in lowest form.
6. Stopping Euclid's method too early.
7. Mixing up factors and multiples.

## 10) board tips

- In factorisation questions, write each step clearly.
- In HCF and LCM questions, first write prime factors neatly.
- In irrational proofs, do not skip the contradiction step.
- In decimal questions, always factorise the denominator.
- Use math symbols carefully. One small sign error can spoil the full answer.

## 11) how to remember the chapter

### memory box 1
Prime factorisation is the backbone of the chapter.
If this is clear, half the chapter becomes easy.

### memory box 2
For HCF and LCM:
- HCF = common and smallest power
- LCM = all and biggest power

### memory box 3
For irrational numbers:
If assuming `p/q` creates a contradiction, the number is irrational.

### memory box 4
For decimals:
Only `2` and `5` in denominator means terminating decimal.

## 12) solved practice set

### question 1
Write `5005` as a product of prime factors.

Answer:
`5005 = 5 × 7 × 11 × 13`

### question 2
Write `7429` as a product of prime factors.

Answer:
`7429 = 17 × 19 × 23`

### question 3
Find the HCF and LCM of `12` and `15`.

Answer:
`12 = 2² × 3`
`15 = 3 × 5`

So,
`HCF = 3`
`LCM = 2² × 3 × 5 = 60`

### question 4
Is `0.125` rational or irrational?

Answer:
Rational.
Because `0.125 = 125/1000 = 1/8`.

### question 5
Does `11/24` terminate?

Answer:
No.
Because `24 = 2³ × 3` and the denominator has `3` also.
So the decimal is non-terminating repeating.

### question 6
Why is `√3` irrational?

Answer:
The proof follows the same contradiction method used for `√2`.
If we assume `√3 = a/b` in lowest form, both `a` and `b` become divisible by `3`, which is impossible.

## 13) short answer practice

1. What is the difference between rational and irrational numbers?
2. Why is prime factorisation called unique?
3. How do you find HCF from prime factors?
4. How do you find LCM from prime factors?
5. Why must a fraction be in lowest form before checking its decimal type?
6. Why is `1` not a prime number?

## 14) mini quiz with answers

### quiz
1. `140` in prime factor form is:
   - a) `2 × 2 × 5 × 7`
   - b) `2 × 3 × 5 × 7`
   - c) `2 × 2 × 7 × 7`
   - d) `5 × 5 × 7`

2. HCF of `26` and `91` is:
   - a) `7`
   - b) `13`
   - c) `26`
   - d) `91`

3. Which number is irrational?
   - a) `0.75`
   - b) `7/9`
   - c) `√5`
   - d) `-3`

4. Which denominator gives a terminating decimal in lowest form?
   - a) `12`
   - b) `15`
   - c) `20`
   - d) `21`

5. In Euclid's method, when remainder becomes zero, the answer is:
   - a) quotient
   - b) dividend
   - c) last divisor
   - d) first divisor

### answer key
1. a
2. b
3. c
4. c
5. c

## 15) content style note for future lessons

When we turn this chapter into lesson pages, every lesson should use:
- very short paragraphs
- one idea at a time
- one solved example after every concept
- one common mistake box
- one memory trick box
- one quick practice block

Weak students do better when the content feels like a patient teacher, not like a textbook wall.

## 16) lesson files created from this chapter

The first lesson-wise split now exists in:
`docs/content/class-10/mathematics/real-numbers/lessons/`

Created files:
1. `01-euclid-division-lemma.md`
2. `02-fundamental-theorem-of-arithmetic.md`
3. `03-hcf-and-lcm-by-prime-factorisation.md`
4. `04-irrational-numbers.md`
5. `05-decimal-expansion-of-rational-numbers.md`
6. `index.md`

## 17) next content pieces to create from these lessons

1. Chapter quiz: 15 questions
2. Board-style worksheet: easy, medium, hard
3. Admin-friendly structured JSON or seed data version
4. Lesson summaries for free preview cards
5. Topic-to-NCERT exercise mapping

## comic style recap

Panel 1: Prime Brick Builder breaks numbers into prime blocks: "Every composite has one fingerprint."

Panel 2: HCF Hero hugs only the common factors: "Smallest shared powers are mine."

Panel 3: LCM Loader collects all factors: "Biggest powers come with me."

Panel 4: Irrational Imp refuses the fraction gate: "I cannot be written as `p/q`."
