---
title: 1.3 Revisiting Irrational Numbers
subject: Mathematics
class_level: 10
chapter: Real Numbers
chapter_slug: real-numbers
lesson_number: 2
lesson_slug: irrational-numbers
estimated_minutes: 32
access_level: premium
status: ready
source_textbook: textbooks/maths/jemh101.pdf
---

# 1.3 Revisiting Irrational Numbers

An irrational number cannot be written as $\frac{p}{q}$, where $p$ and $q$ are integers and $q\ne0$. Its decimal form is non-terminating and non-repeating.

## 1.3 Revisiting Irrational Numbers

You have already met $\sqrt2$, $\sqrt3$, $\sqrt5$ and many similar numbers. Here the goal is to prove irrationality with the Fundamental Theorem of Arithmetic.

### Proof by contradiction

The method has five steps:

1. Assume the opposite of what you want to prove.
2. Write the assumed rational number in lowest form.
3. Use algebra and Theorem 1.2.
4. Reach a fact that contradicts "lowest form".
5. Reject the assumption and state the conclusion.

### Theorem 1.3: $\sqrt2$ is irrational

Assume $\sqrt2$ is rational. Then

$$\sqrt2=\frac ab,$$

where $a$ and $b$ are coprime positive integers.

Squaring gives $a^2=2b^2$. So $2$ divides $a^2$, and Theorem 1.2 gives $2\mid a$. Let $a=2c$.

Substitution gives $4c^2=2b^2$, so $b^2=2c^2$. Hence $2\mid b$.

Both $a$ and $b$ are even. This contradicts the assumption that they are coprime. Therefore, $\sqrt2$ is irrational.

**Example 5**

Prove that $\sqrt3$ is irrational.

**Solution:**
Assume $\sqrt3=\frac ab$ in lowest form. Then $a^2=3b^2$, so $3\mid a$. Put $a=3c$. This gives $b^2=3c^2$, so $3\mid b$. The common factor $3$ contradicts lowest form. Therefore, $\sqrt3$ is irrational.

### Rational and irrational combinations

- rational $+$ irrational is irrational
- rational $-$ irrational is irrational
- non-zero rational $\times$ irrational is irrational
- irrational $\div$ non-zero rational is irrational

These rules are used only when the rational multiplier or divisor is non-zero.

**Example 6**

Show that $5-\sqrt3$ is irrational.

**Solution:**
If $5-\sqrt3$ were rational, subtracting it from the rational number $5$ would make $\sqrt3$ rational. That contradicts Example 5. Hence $5-\sqrt3$ is irrational.

**Example 7**

Show that $3\sqrt2$ is irrational.

**Solution:**
If $3\sqrt2$ were rational, dividing it by the non-zero rational number $3$ would make $\sqrt2$ rational. This is impossible. Hence $3\sqrt2$ is irrational.

## Common mistakes

- not saying that $a$ and $b$ are coprime
- proving only that $a$ is divisible by the prime and forgetting $b$
- writing "contradiction" without naming the contradiction
- assuming every sum of two irrational numbers is irrational; for example, $\sqrt2+(-\sqrt2)=0$

## Board tips

- Keep each implication on its own line.
- End with a complete sentence: "This contradicts that $a$ and $b$ are coprime; therefore..."
- For $r+s\sqrt p$, isolate the irrational term instead of repeating the full square-root proof.

## Quick practice

1. Prove that $\sqrt5$ is irrational.
2. Explain why $7\sqrt5$ is irrational.
3. Explain why $6+\sqrt2$ is irrational.

## Answer check

1. The same contradiction method forces both numerator and denominator to be divisible by $5$.
2. If $7\sqrt5$ were rational, division by $7$ would make $\sqrt5$ rational.
3. If $6+\sqrt2$ were rational, subtracting $6$ would make $\sqrt2$ rational.

## One-minute revision

- Start with a lowest-form fraction.
- A prime dividing $a^2$ also divides $a$.
- Force the same prime to divide numerator and denominator.
- Name the contradiction and reject the assumption.

## Comic recap

- Assumption: "Suppose the square root is rational."
- Theorem 1.2: "A prime inside the square must divide its base."
- Contradiction: "Both fraction parts share a factor!"
- Conclusion: "The lowest-form assumption fails, so the number is irrational."
