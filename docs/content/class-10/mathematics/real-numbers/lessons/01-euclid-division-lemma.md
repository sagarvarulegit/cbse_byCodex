---
title: Euclid division lemma
subject: Mathematics
class_level: 10
chapter: Real Numbers
chapter_slug: real-numbers
lesson_number: 1
lesson_slug: euclid-division-lemma
estimated_minutes: 8
access_level: free
status: draft
---

# Euclid division lemma

This lesson is a support lesson for the Real Numbers chapter. It helps students understand division properly and makes HCF easier later.

## learning goal

By the end of this lesson, a student should be able to:
- understand the form `a = bq + r`
- identify divisor, quotient, and remainder
- use repeated division to find HCF

## quick warm-up

When we divide `17` by `5`, what happens?

`17 = 5 × 3 + 2`

So:
- divisor = `5`
- quotient = `3`
- remainder = `2`

This is the basic idea of Euclid division lemma.

## the rule in simple English

When a positive integer `a` is divided by another positive integer `b`, we can always write:

`a = bq + r`

where:
- `q` is the quotient
- `r` is the remainder
- `0 ≤ r < b`

## what this means

It simply means:

`dividend = divisor × quotient + remainder`

This is not a new trick. It is just the long division idea written in math form.

## important condition

The remainder must be smaller than the divisor.

Correct:
`23 = 5 × 4 + 3`

Wrong:
`23 = 5 × 3 + 8`

Why is the second one wrong?
Because the remainder `8` is bigger than the divisor `5`.

## easy examples

### example 1
Divide `20` by `6`.

`20 = 6 × 3 + 2`

So:
- quotient = `3`
- remainder = `2`

### example 2
Divide `35` by `7`.

`35 = 7 × 5 + 0`

So:
- quotient = `5`
- remainder = `0`

When remainder is `0`, the division is exact.

## why this lesson matters in this chapter

This idea is used in the Euclid algorithm for finding HCF.

Instead of factorising big numbers every time, we can keep dividing.
That is often faster.

## finding HCF using Euclid's method

### rule
1. Divide the bigger number by the smaller number.
2. Take the remainder.
3. Now divide the old divisor by the remainder.
4. Keep going.
5. When remainder becomes `0`, the last divisor is the HCF.

## solved example 1
Find `HCF(455, 42)`.

Step 1:
`455 = 42 × 10 + 35`

Step 2:
`42 = 35 × 1 + 7`

Step 3:
`35 = 7 × 5 + 0`

Now the remainder is `0`.
So the last divisor is `7`.

Answer:
`HCF(455, 42) = 7`

## solved example 2
Find `HCF(135, 225)`.

Take the bigger number first.

`225 = 135 × 1 + 90`
`135 = 90 × 1 + 45`
`90 = 45 × 2 + 0`

So the last divisor is `45`.

Answer:
`HCF(135, 225) = 45`

## how to think without fear

Many students get scared when they see many steps.
Do not worry.
Just remember one thing:

Keep dividing until the remainder becomes zero.

That is the whole game.

## common mistakes

1. Starting with the smaller number as dividend.
2. Forgetting to use the remainder in the next step.
3. Stopping one step too early.
4. Writing the quotient correctly but the remainder wrongly.
5. Giving remainder as the final HCF.

## memory trick

Remainder drives the next step.
Last divisor gives the answer.

## board tip

Write each line neatly on a new line. That makes the method easy to follow and easy to check.

## solved mini check

Find `HCF(84, 30)`.

`84 = 30 × 2 + 24`
`30 = 24 × 1 + 6`
`24 = 6 × 4 + 0`

So,
`HCF(84, 30) = 6`

## quick practice

1. Write `29` divided by `4` in the form `a = bq + r`.
2. Write `50` divided by `8` in the form `a = bq + r`.
3. Find `HCF(72, 30)` using Euclid's method.
4. Find `HCF(96, 36)` using Euclid's method.

## answer check

1. `29 = 4 × 7 + 1`
2. `50 = 8 × 6 + 2`
3. `72 = 30 × 2 + 12`, `30 = 12 × 2 + 6`, `12 = 6 × 2 + 0`, so HCF is `6`
4. `96 = 36 × 2 + 24`, `36 = 24 × 1 + 12`, `24 = 12 × 2 + 0`, so HCF is `12`

## one-minute revision

- Euclid division lemma is `a = bq + r`
- remainder must be smaller than divisor
- to find HCF, keep dividing
- when remainder becomes zero, last divisor is the HCF

## remember this line

Big number = divisor × quotient + what is left.
