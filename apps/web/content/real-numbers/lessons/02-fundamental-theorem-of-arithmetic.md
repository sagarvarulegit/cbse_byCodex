---
title: 1.1-1.2 The Fundamental Theorem of Arithmetic
subject: Mathematics
class_level: 10
chapter: Real Numbers
chapter_slug: real-numbers
lesson_number: 1
lesson_slug: fundamental-theorem-of-arithmetic
estimated_minutes: 38
access_level: free
status: ready
source_textbook: textbooks/maths/jemh101.pdf
---

# 1.1-1.2 The Fundamental Theorem of Arithmetic

Think of every composite number as a model built from prime-number bricks. You can rearrange the bricks, but you cannot secretly replace them with different prime bricks.

## 1.1 Introduction

You already know Euclid's division algorithm from Class IX. This chapter now uses a different idea: prime factorisation. It helps us find HCF and LCM, test whether certain powers can end in zero, and prove irrationality.

The current chapter has two core ideas:

- the Fundamental Theorem of Arithmetic
- irrational numbers and proof by contradiction

## 1.2 The Fundamental Theorem of Arithmetic

A prime number has exactly two positive factors: $1$ and itself. A composite number has more than two positive factors.

**Remember:** The number $1$ is neither prime nor composite.

The theorem says:

**Fundamental Theorem of Arithmetic:** Every composite number can be expressed as a product of primes, and this factorisation is unique apart from the order of the prime factors.

For example,

$$32760=2^3\times3^2\times5\times7\times13.$$

Writing the same primes in another order does not create a different factorisation.

### Figure tracker

- The factor tree on the opening pages breaks $32760$ down to prime factors.
- The Carl Friedrich Gauss box explains why the theorem is also called the unique factorisation theorem.

[[demo:math-ch1-prime-factor-tree]]

### Theorem 1.2

Let $p$ be a prime number. If $p$ divides $a^2$, then $p$ divides $a$, where $a$ is a positive integer.

This result is used in the irrationality proofs in Section 1.3.

**Example 1**

Can $4^n$ end with the digit $0$ for a natural number $n$?

**Solution:**
$4^n=2^{2n}$. A number ending in $0$ must contain both $2$ and $5$ in its prime factorisation. No factor $5$ occurs, so $4^n$ cannot end in $0$.

**Example 2**

Find the HCF and LCM of $6$ and $20$ by prime factorisation.

**Solution:**
$6=2\times3$ and $20=2^2\times5$.

$$\operatorname{HCF}=2,\qquad \operatorname{LCM}=2^2\times3\times5=60.$$

For two positive integers $a$ and $b$,

$$\operatorname{HCF}(a,b)\times\operatorname{LCM}(a,b)=a\times b.$$

**Example 3**

Find the HCF of $96$ and $404$. Hence, find their LCM.

**Solution:**
$96=2^5\times3$ and $404=2^2\times101$.

$$\operatorname{HCF}=2^2=4.$$

$$\operatorname{LCM}=\frac{96\times404}{4}=9696.$$

**Example 4**

Find the HCF and LCM of $6$, $72$ and $120$.

**Solution:**
$6=2\times3$, $72=2^3\times3^2$, and $120=2^3\times3\times5$.

$$\operatorname{HCF}=2\times3=6,$$

$$\operatorname{LCM}=2^3\times3^2\times5=360.$$

**Remember:** The product rule for HCF and LCM is stated here for two positive integers. Do not apply it unchanged to three numbers.

## Common mistakes

- stopping the factorisation while a composite factor remains
- using largest powers for HCF instead of the smallest common powers
- forgetting a prime that occurs in only one number while finding LCM
- saying a power ends in zero without checking for both $2$ and $5$

## Board tips

- Write the complete prime factorisation before selecting powers.
- In an ending-zero question, connect the last digit to the factor $10=2\times5$.
- In a proof, state the theorem or property you use; do not jump from $p\mid a^2$ to $p\mid a$ without reason.

## Quick practice

1. Write $3825$ as a product of prime factors.
2. Find the HCF and LCM of $26$ and $91$.
3. Can $6^n$ end in $0$ for any natural number $n$?

## Answer check

1. $3825=3^2\times5^2\times17$.
2. HCF $=13$ and LCM $=182$.
3. No. The factorisation of $6^n$ has $2$ and $3$, but no $5$.

## One-minute revision

- Composite numbers have unique prime factorisations.
- HCF takes the smallest common powers.
- LCM takes the largest powers of all required primes.
- A number ending in zero needs both $2$ and $5$.

## Comic recap

- Prime: "I am one indivisible building brick."
- Composite: "Break me fully before you stop."
- HCF: "I keep only the common part."
- LCM: "I collect enough prime powers for everyone."
