---
title: 2.1-2.4 Polynomials
subject: Mathematics
class_level: 10
chapter: Polynomials
chapter_slug: polynomials
lesson_number: 1
lesson_slug: core-notes
estimated_minutes: 52
access_level: free
status: ready
source_textbook: textbooks/maths/jemh102.pdf
---

# 2.1-2.4 Polynomials

A graph can reveal an algebraic answer without solving an equation first. Wherever $y=p(x)$ meets the $x$-axis, $p(x)$ becomes zero.

## 2.1 Introduction

A polynomial in one variable uses non-negative integer powers of that variable. Its degree is the highest power with a non-zero coefficient.

- $2x-3$ is linear.
- $x^2-3x+4$ is quadratic.
- $2x^3-5x^2+x-1$ is cubic.

If $p(k)=0$, then $k$ is a zero of $p(x)$.

For $p(x)=2x+3$, the zero is $x=-3/2$ because $2(-3/2)+3=0$.

## 2.2 Geometrical Meaning of the Zeroes of a Polynomial

The graph of $y=p(x)$ meets or touches the $x$-axis exactly where $y=0$. Therefore, the $x$-coordinates of those points are the zeroes of $p(x)$.

### Linear polynomial

The graph of $ax+b$, $a\ne0$, is a line. It has exactly one zero, $-b/a$.

### Quadratic polynomial

The graph of $ax^2+bx+c$, $a\ne0$, is a parabola. It may:

- cut the $x$-axis twice: two distinct zeroes
- touch the $x$-axis once: two equal zeroes
- miss the $x$-axis: no real zero

### Cubic polynomial

A cubic graph may have one, two or three distinct zeroes. In general, a polynomial of degree $n$ has at most $n$ zeroes.

### NCERT figure and table tracker

- Figure 2.1: line $y=2x+3$ and its one zero
- Figure 2.2 and Table 2.1: parabola $y=x^2-3x-4$ with zeroes $-1$ and $4$
- Figures 2.3-2.5: quadratic graphs with two, one and no zeroes
- Figures 2.6-2.8 and Table 2.2: cubic graphs with three, one and two distinct zeroes
- Figure 2.9: the six graphs used in Example 1
- Figure 2.10: the six graphs used in Exercise 2.1

[[demo:math-ch2-polynomial-zeroes]]

**Example 1**

Read the number of zeroes from the six graphs in Figure 2.9.

**Solution:**
Count only the points where each curve meets the $x$-axis. The six graphs have $1$, $2$, $3$, $1$, $1$ and $4$ zeroes respectively.

## 2.3 Relationship between Zeroes and Coefficients of a Polynomial

Let $\alpha$ and $\beta$ be the zeroes of

$$p(x)=ax^2+bx+c,\qquad a\ne0.$$

Then

$$\alpha+\beta=-\frac ba,\qquad \alpha\beta=\frac ca.$$

Reason: $p(x)=a(x-\alpha)(x-\beta)$, so comparing coefficients gives the two relations.

**Example 2**

Find the zeroes of $x^2+7x+10$ and verify the relations.

**Solution:**
$x^2+7x+10=(x+2)(x+5)$, so $\alpha=-2$ and $\beta=-5$.

$$\alpha+\beta=-7=-\frac71,\qquad \alpha\beta=10=\frac{10}{1}.$$

**Example 3**

Find the zeroes of $x^2-3$ and verify the relations.

**Solution:**
The zeroes are $\sqrt3$ and $-\sqrt3$. Their sum is $0$ and product is $-3$, matching $-b/a$ and $c/a$.

**Example 4**

Find a quadratic polynomial whose zeroes have sum $-3$ and product $2$.

**Solution:**
A monic polynomial is

$$x^2-(\alpha+\beta)x+\alpha\beta=x^2+3x+2.$$

Any non-zero multiple of this polynomial has the same zeroes.

### Textbook extension

The book displays the corresponding three coefficient relations for a cubic polynomial and verifies them in Example 5. The example is marked as not from the examination point of view. The active curriculum assesses the quadratic relation.

## 2.4 Summary

- A zero is a value that makes $p(x)=0$.
- Graphically, zeroes are $x$-intercepts.
- Degree $n$ gives at most $n$ zeroes.
- For a quadratic, sum $=-b/a$ and product $=c/a$.

## Common mistakes

- counting a $y$-axis crossing as a zero
- saying a quadratic must have two distinct real zeroes
- using $b/a$ instead of $-b/a$
- forgetting that many non-zero scalar multiples can have the same zeroes

## Board tips

- Write $a$, $b$ and $c$ after putting the polynomial in standard form.
- In a graph question, count intersections or touches with the $x$-axis.
- When building a polynomial, use $x^2-(\text{sum})x+(\text{product})$.

## Quick practice

1. Find the zeroes of $2x^2-7x+3$.
2. State their sum and product without solving again.
3. Form a quadratic polynomial with zeroes $2$ and $5$.

## Answer check

1. $(2x-1)(x-3)=0$, so the zeroes are $1/2$ and $3$.
2. Sum $=7/2$ and product $=3/2$.
3. $x^2-7x+10$ is one such polynomial.

## One-minute revision

Zero means $y=0$. For a quadratic: sum $=-b/a$, product $=c/a$.

## Comic recap

- Graph: "Meet my $x$-axis crossings."
- Zero: "At my value, the polynomial becomes zero."
- Sum: "For a quadratic, I am $-b/a$."
- Product: "And I am $c/a$."
