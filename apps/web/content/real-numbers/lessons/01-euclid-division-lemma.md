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

**Scope note:** This is an unnumbered Class IX support lesson. It is not a numbered core section of the current NCERT Class 10 Chapter 1 PDF or active 2026-27 board scope.

This lesson is a support lesson for the `Real Numbers` chapter. It helps us understand division properly first, so `HCF` questions later do not feel scary.

Also, one small English help before we start: `lemma` means a small helpful rule. So do not panic. Big word, simple idea.

## chapter start: what is a `real number`?

A `real number` is any number that can be shown on the number line.

Examples:
- `5`
- `0`
- `-3`
- `3/4`
- `0.25`
- `√2`

So yes, this chapter is about many kinds of numbers. Nice crowd.

## quick warm-up: first see it the school way

When we divide `17` by `5`, most Indian students think in long-division form first. That is the right starting point.

[[demo:warmup-17-5]]

From that long division, we get:
- `dividend` = `17`
- `divisor` = `5`
- `quotient` = `3`
- `remainder` = `2`

Now write the same idea in one line:

`17 = 5 × 3 + 2`

So the long-division picture and the equation are saying the same thing.

## the rule in simple English

When a positive integer `a` is divided by another positive integer `b`, we can always write:

`a = bq + r`

where:
- `a` is the `dividend`
- `b` is the `divisor`
- `q` is the `quotient`
- `r` is the `remainder`
- `0 ≤ r < b`

## what this really means

It simply means:

`dividend = divisor × quotient + remainder`

So this is not a new monster. It is just your old long division written in math language.

## important condition

The `remainder` must always be smaller than the `divisor`.

Correct:
`23 = 5 × 4 + 3`

Wrong:
`23 = 5 × 3 + 8`

Why is the second one wrong?
Because the `remainder` `8` is bigger than the `divisor` `5`.

## easy examples

### example 1
Divide `20` by `6`.

`20 = 6 × 3 + 2`

So:
- `quotient` = `3`
- `remainder` = `2`

### example 2
Divide `35` by `7`.

`35 = 7 × 5 + 0`

So:
- `quotient` = `5`
- `remainder` = `0`

When `remainder` is `0`, the division is exact.

## why this lesson matters in this chapter

This idea is used in the Euclid method for finding `HCF` (Highest Common Factor).

Instead of doing `factorisation` for big numbers every time, we can keep dividing. That is often faster.

## finding `HCF` using Euclid's method

### rule
1. Divide the bigger number by the smaller number.
2. Look at the `remainder`.
3. If the `remainder` is not `0`, divide again.
4. In the next step, use the old `divisor` and the old `remainder`.
5. When the `remainder` becomes `0`, stop.
6. The last `divisor` gives the `HCF`.

## solved example 1
Find `HCF(455, 42)`.

First write the steps:

Step 1:
`455 = 42 × 10 + 35`

Step 2:
`42 = 35 × 1 + 7`

Step 3:
`35 = 7 × 5 + 0`

Now see the same idea in long-division style.

[[demo:euclid-hcf-455-42]]

Now the `remainder` is `0`.
So the last `divisor` is `7`.

Answer:
`HCF(455, 42) = 7`

## solved example 2
Find `HCF(135, 225)`.

Take the bigger number first.

`225 = 135 × 1 + 90`
`135 = 90 × 1 + 45`
`90 = 45 × 2 + 0`

Now the `remainder` is `0`, so stop.
The last `divisor` is `45`.

Answer:
`HCF(135, 225) = 45`

## how to think without fear

Many students get scared when they see many steps.
Do not worry.
Just remember this:

- non-zero `remainder` → divide again
- `remainder` `0` → stop
- last `divisor` → answer

That is the whole game. No drama needed.

## common mistakes

1. Starting with the smaller number as `dividend`
2. Forgetting to use the `remainder` in the next step
3. Stopping one step too early
4. Writing the `quotient` correctly but the `remainder` wrongly
5. Giving the `remainder` as the final `HCF`

## memory trick

- Non-zero `remainder`? Divide again.
- Old `divisor` and old `remainder` make the next division.
- `Remainder = 0`? Stop.
- Last `divisor` gives the answer.

## board tip

Write each division on a new line.
Neat steps save marks. Messy steps donate marks to the examiner.

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
3. `72 = 30 × 2 + 12`, `30 = 12 × 2 + 6`, `12 = 6 × 2 + 0`, so `HCF = 6`
4. `96 = 36 × 2 + 24`, `36 = 24 × 1 + 12`, `24 = 12 × 2 + 0`, so `HCF = 12`

## one-minute revision

- `Euclid division lemma` is `a = bq + r`
- the `remainder` must be smaller than the `divisor`
- to find `HCF`, keep dividing
- if the `remainder` is not `0`, divide again
- when the `remainder` becomes `0`, the last `divisor` is the `HCF`

## comic recap

- `Remainder`: “I am not zero yet. One more round.”
- `Divisor`: “Fine. I will come back in the next step.”
- `Remainder = 0`: “Okay friends, show is over.”
- `Last divisor`: “Thanks. I am the `HCF`.”

## remember this line

Big number = `divisor × quotient + what is left`.
