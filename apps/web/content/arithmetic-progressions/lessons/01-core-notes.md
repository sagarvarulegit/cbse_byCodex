---
title: 5.1-5.5 Arithmetic Progressions
subject: Mathematics
class_level: 10
chapter: Arithmetic Progressions
chapter_slug: arithmetic-progressions
lesson_number: 1
lesson_slug: core-notes
estimated_minutes: 74
access_level: free
status: ready
source_textbook: textbooks/maths/jemh105.pdf
---

# 5.1-5.5 Arithmetic Progressions

Rows of seats, yearly salaries, savings, plant patterns and stacked logs can all grow by a fixed amount. That fixed change creates an arithmetic progression.

## 5.1 Introduction

Figures 5.1-5.3 introduce ladder-rung lengths, square patterns and rabbit counts. Some patterns change by adding the same fixed number; those are the patterns studied here.

[[demo:math-ch5-ap-patterns]]

## 5.2 Arithmetic Progressions

An arithmetic progression (AP) is a list in which every term after the first is obtained by adding a fixed number to the preceding term. That fixed number is the common difference $d$.

The general form is

$$a,\ a+d,\ a+2d,\ a+3d,\ldots$$

For consecutive terms,

$$d=a_k-a_{k-1}.$$

The difference may be positive, negative or zero.

**Example 1** identifies the first term and common difference in a fractional AP.

**Example 2** checks several lists by comparing every pair of consecutive terms. A list is an AP only if all those differences are equal.

## 5.3 nth Term of an AP

If the first term is $a$ and common difference is $d$, then

$$a_n=a+(n-1)d.$$

The position $n$ must be a positive integer.

**Example 3**

The 10th term of $2,7,12,\ldots$ is

$$a_{10}=2+9(5)=47.$$

**Example 4** finds that $-81$ is the 35th term of $21,18,15,\ldots$, while $0$ is its 8th term.

**Example 5** uses the 3rd and 7th terms to find $a=3$, $d=1$, giving $3,4,5,6,\ldots$.

**Examples 6-10** apply the formula to membership, two-digit multiples of $3$, a term counted from the end, simple-interest growth, and rose-plant rows.

## 5.4 Sum of First n Terms of an AP

The Gauss pairing shown in the textbook leads to

$$S_n=\frac n2\left[2a+(n-1)d\right].$$

Since $a_n=a+(n-1)d$, we may also write

$$S_n=\frac n2(a+a_n).$$

Use the second form when the first and last terms are known.

**Example 11**

For $8,3,-2,\ldots$, $a=8$, $d=-5$, $n=22$:

$$S_{22}=\frac{22}{2}[16+21(-5)]=-979.$$

**Example 12** finds the 20th term when $S_{14}=1050$ and $a=10$.

**Example 13** shows why an equation for $S_n$ may give two positive values of $n$ when the middle terms of a decreasing AP are negative.

**Examples 14-16** cover sums of natural numbers, a list defined by its nth term, and yearly television production.

### NCERT figure and end-matter tracker

- Figures 5.1-5.3: opening AP patterns
- Figures 5.4-5.6: semicircle sequence, log stack and potato race
- Figures 5.7-5.8: optional ladder and step applications
- Exercise 5.4 is explicitly optional and not from the examination point of view.
- The Note to the Reader defines the arithmetic mean of $a$ and $c$ as $(a+c)/2$.

## 5.5 Summary

- AP: $a,a+d,a+2d,\ldots$
- nth term: $a_n=a+(n-1)d$
- sum: $S_n=\frac n2[2a+(n-1)d]$
- if the last term $l$ is known: $S_n=\frac n2(a+l)$

## Common mistakes

- using $a+nd$ instead of $a+(n-1)d$
- checking only the first two differences
- using a non-integer or non-positive value as a term number
- confusing $a_n$ with $S_n$

## Board tips

- Write $a$, $d$ and $n$ before substituting.
- For a term from the end, reverse the finite AP or first find its term count.
- In an application, say what the chosen term or sum represents.

## Quick practice

1. Find the 20th term of $5,9,13,\ldots$.
2. Is $301$ a term of $5,11,17,\ldots$?
3. Find the sum of the first 20 positive integers.

## Answer check

1. $a_{20}=5+19(4)=81$.
2. No; $5+(n-1)6=301$ gives $n=50\frac13$, not a positive integer.
3. $S_{20}=20(21)/2=210$.

## One-minute revision

Term asks for $a_n$. Total asks for $S_n$. Both depend on the fixed difference $d$.

## Comic recap

- First term: "I start the pattern."
- Common difference: "I make every step equal."
- nth term: "I jump straight to one position."
- Sum: "I collect every term up to that position."
