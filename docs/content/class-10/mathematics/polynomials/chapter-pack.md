---
title: Polynomials
audience: CBSE Class 10
subject: Mathematics
chapter_number: 2
chapter_slug: polynomials
status: draft
content_type: chapter-pack
---

# Polynomials

This is an original teaching draft for Class 10 Mathematics, Chapter 2. The language stays simple so students can revise fast and still understand what each result means.

## chapter goal

By the end of this chapter, a student should be able to:
- identify the degree and type of a polynomial
- find the value and zeroes of a polynomial
- understand the geometric meaning of zeroes
- use the relation between zeroes and coefficients for quadratic polynomials
- apply the division algorithm correctly

## teacher note on textbook alignment

The current NCERT Class 10 chapter strongly focuses on:
- meaning and forms of polynomials
- zeroes of linear and quadratic polynomials
- graph-based idea of zeroes
- relation between zeroes and coefficients
- division algorithm for polynomials

## chapter flow for the platform

1. Algebraic expressions and what makes a polynomial
2. Degree and types of polynomials
3. Value of a polynomial
4. Zeroes of a polynomial
5. Geometric meaning of zeroes
6. Relation between zeroes and coefficients
7. Division algorithm
8. Quick revision and practice

## 1) algebraic expressions and polynomials

An algebraic expression may contain variables, constants, addition, subtraction, and multiplication.

A polynomial is a special algebraic expression where:
- powers of the variable are whole numbers
- no variable appears in the denominator

Examples of polynomials:
- `x + 3`
- `2x^2 - 5x + 7`
- `4y^3 + y - 9`

Not polynomials:
- `1/x + 2`
- `sqrt(x) + 1`

### easy memory line
In a polynomial, the variable power must be `0, 1, 2, 3, ...`

## 2) degree and types of polynomials

The degree of a polynomial is the highest power of the variable.

Examples:
- `5` has degree `0`
- `3x + 1` has degree `1`
- `x^2 - 4x + 6` has degree `2`
- `2x^3 + 7` has degree `3`

Important names:
- degree `1` -> linear polynomial
- degree `2` -> quadratic polynomial
- degree `3` -> cubic polynomial

### by number of terms
- monomial: one term, like `7x^2`
- binomial: two terms, like `x + 5`
- trinomial: three terms, like `x^2 + 3x + 2`

## 3) value of a polynomial

To find the value of a polynomial, substitute the given value of the variable.

Example:
If `p(x) = x^2 - 3x + 2`, then

`p(2) = 2^2 - 3(2) + 2 = 4 - 6 + 2 = 0`

This idea is important because zeroes are found using the same substitution method.

## 4) zeroes of a polynomial

A zero of a polynomial is a value of the variable that makes the polynomial equal to zero.

If `p(a) = 0`, then `a` is a zero of `p(x)`.

### examples

For `p(x) = x - 5`:

`p(5) = 5 - 5 = 0`

So `5` is a zero.

For `p(x) = x^2 - 5x + 6`:

`x^2 - 5x + 6 = (x - 2)(x - 3)`

So the zeroes are `2` and `3`.

### important fact
- a linear polynomial has one zero
- a quadratic polynomial can have two zeroes
- a cubic polynomial can have up to three zeroes

## 5) geometric meaning of zeroes

The zeroes of a polynomial are the x-coordinates where its graph meets the x-axis.

### for a linear polynomial
The graph is a straight line.
If the line cuts the x-axis at one point, that x-value is the zero.

### for a quadratic polynomial
The graph is a curve.
It may:
- cut the x-axis at two points
- touch the x-axis at one point
- not meet the x-axis at all

The x-coordinates of the intersection points are the zeroes.

### board tip
Zeroes come from where `y = 0`, not where the graph meets the y-axis.

## 6) relation between zeroes and coefficients

For a quadratic polynomial:

`ax^2 + bx + c`, where `a != 0`

If the zeroes are `alpha` and `beta`, then:

- `alpha + beta = -b/a`
- `alpha * beta = c/a`

### why this matters
This helps us:
- check an answer quickly
- build a quadratic polynomial from given zeroes

### solved example

For `2x^2 - 7x + 3`

Here:
- `a = 2`
- `b = -7`
- `c = 3`

So:
- sum of zeroes = `-(-7)/2 = 7/2`
- product of zeroes = `3/2`

### making a polynomial from zeroes

If zeroes are `2` and `5`, then the polynomial is:

`k(x - 2)(x - 5)`

If we take `k = 1`, a simple polynomial is:

`x^2 - 7x + 10`

## 7) division algorithm for polynomials

The polynomial division algorithm says:

`Dividend = Divisor x Quotient + Remainder`

This is exactly like ordinary division.

### important rule
Degree of remainder must be less than degree of divisor.

### example
Divide `x^2 - 3x + 2` by `x - 1`.

We know:

`x^2 - 3x + 2 = (x - 1)(x - 2) + 0`

So:
- quotient = `x - 2`
- remainder = `0`

### special result
If remainder is `0`, then the divisor is a factor of the polynomial.

## 8) exam-friendly summary notes

### must-know facts
- A polynomial cannot have negative or fractional powers of the variable.
- A zero makes the polynomial value equal to `0`.
- Zeroes are the x-intercepts of the graph.
- For `ax^2 + bx + c`, sum of zeroes is `-b/a`.
- For `ax^2 + bx + c`, product of zeroes is `c/a`.
- `Dividend = Divisor x Quotient + Remainder`

### one-line revision points
- degree = highest power
- zero means answer becomes zero
- graph meets x-axis at zeroes
- sum uses coefficient of `x`
- product uses constant term

## 9) common mistakes students make

1. Calling `1/x` a polynomial term.
2. Mixing degree with number of terms.
3. Forgetting that zeroes are x-values, not y-values.
4. Writing `alpha + beta = b/a` instead of `-b/a`.
5. Forgetting the condition `a != 0` in a quadratic polynomial.
6. Leaving a remainder whose degree is not less than the divisor.

## 10) board tips

- Write the polynomial in standard form before comparing coefficients.
- In zeroes and coefficients questions, name `a`, `b`, and `c` clearly.
- In graph questions, mention that the x-coordinate of the intersection gives the zero.
- In division questions, always end by writing quotient and remainder separately.

## 11) how to remember the chapter

### memory box 1
Polynomial means clean powers of the variable.

### memory box 2
Zero of polynomial = value that kills the expression.

### memory box 3
For a quadratic:
- sum = `-b/a`
- product = `c/a`

### memory box 4
Division algorithm for polynomials behaves like normal division.

## 12) solved practice set

### question 1
Find the degree of `7x^3 - 2x + 9`.

Answer:
Highest power is `3`, so degree is `3`.

### question 2
Check whether `2` is a zero of `x^2 - 5x + 6`.

Answer:
`p(2) = 4 - 10 + 6 = 0`
So `2` is a zero.

### question 3
Find the sum and product of zeroes of `x^2 - 9x + 14`.

Answer:
- sum = `-(-9)/1 = 9`
- product = `14/1 = 14`

### question 4
Write a quadratic polynomial whose zeroes are `1` and `4`.

Answer:
`(x - 1)(x - 4) = x^2 - 5x + 4`

### question 5
If the graph of a polynomial cuts the x-axis at `x = -3`, what does it mean?

Answer:
It means `-3` is a zero of the polynomial.

## 13) short answer practice

1. What is the difference between an algebraic expression and a polynomial?
2. Can a polynomial have `1/x` as a term? Why?
3. What is the geometric meaning of a zero?
4. How do you find the sum of zeroes of a quadratic polynomial?
5. What does zero remainder tell you in polynomial division?

## 14) mini quiz with answers

### quiz
1. Degree of `9x^2 + 3x - 1` is:
   - a) `1`
   - b) `2`
   - c) `3`
   - d) `9`

2. If `p(4) = 0`, then `4` is:
   - a) coefficient
   - b) degree
   - c) zero
   - d) remainder

3. For `x^2 - 6x + 8`, the sum of zeroes is:
   - a) `-6`
   - b) `6`
   - c) `8`
   - d) `-8`

4. In a polynomial division, the degree of remainder is:
   - a) greater than divisor
   - b) equal to divisor
   - c) less than divisor
   - d) always zero

5. Zeroes of a polynomial are seen on the:
   - a) y-axis
   - b) x-axis
   - c) origin only
   - d) slope line

### answer key
1. b
2. c
3. b
4. c
5. b

## 15) content style note for future lessons

When this chapter is split into lesson pages, keep one small concept at a time:
- one lesson on zeroes and graph meaning
- one lesson on coefficient relations
- one lesson on division algorithm

Students usually confuse formula recall with concept meaning in this chapter, so both should be shown together.

## comic style recap

Panel 1: Polynomial Painter sketches a curve: "Where I touch the x-axis, zeroes appear."

Panel 2: Coefficient Captain says, "My numbers reveal sum and product of zeroes."

Panel 3: Division Algorithm Driver writes dividend equals divisor times quotient plus remainder.

Panel 4: Remainder Rookie checks: "If remainder is zero, division is exact."
