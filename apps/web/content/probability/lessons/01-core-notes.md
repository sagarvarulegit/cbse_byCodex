---
title: 14.1-14.2 Probability
subject: Mathematics
class_level: 10
chapter: Probability
chapter_slug: probability
lesson_number: 1
lesson_slug: core-notes
estimated_minutes: 72
access_level: free
status: ready
source_textbook: textbooks/maths/jemh114.pdf
---

# 14.1-14.2 Probability

Probability is careful counting under a clear assumption: every elementary outcome in the sample space is equally likely.

## 14.1 Probability - A Theoretical Approach

For event $E$ in an experiment with equally likely outcomes,

$$P(E)=\frac{\text{number of outcomes favourable to }E}{\text{number of all possible outcomes}}.$$

An elementary event has exactly one outcome. The probabilities of all elementary events add to $1$.

For any event,

$$0\le P(E)\le1.$$

- impossible event: probability $0$
- sure event: probability $1$

If $\overline E$ means "not $E$", then

$$P(E)+P(\overline E)=1,$$

so $P(\overline E)=1-P(E)$.

### Equally likely warning

A fair coin and fair die have equally likely outcomes. A bag with four red balls and one blue ball does not make "red" and "blue" equally likely; count individual balls.

**Examples 1-3** use a coin, coloured balls and a die to establish the formula, elementary events and complements.

**Example 4** uses a standard $52$-card deck:

- $4$ suits of $13$ cards
- $26$ red and $26$ black cards
- $4$ aces, $4$ kings, $4$ queens, $4$ jacks
- $12$ face cards

**Examples 5-9** cover a tennis match, birthdays, student selection, marbles and two different coins.

**Examples 10-11** use a musical-chair number line and a rectangular crash region. They are marked not from the examination point of view.

**Example 12** converts quality-control counts into probability.

**Example 13** lists the $36$ ordered outcomes for two distinguishable dice. Figure 14.3 is the sample-space table.

[[demo:math-ch14-probability-space]]

### Figure and history tracker

- Figure 14.1: musical-chair interval
- Figure 14.2: rectangular crash region and lake
- Figure 14.3: two-dice sample space
- Figures 14.4-14.6: fish, spinner and dartboard exercises
- Pierre Simon Laplace box: historical note on classical probability

## 14.2 Summary

- Theoretical probability counts favourable outcomes over equally likely outcomes.
- Impossible and certain events have probabilities $0$ and $1$.
- Complements add to $1$.
- The sample space must be complete and its outcomes must not overlap.

### Note to the Reader

Experimental probability comes from observed trials. As trials increase, it may approach the theoretical probability, but the two ideas are not identical.

## Common mistakes

- counting event labels instead of elementary outcomes
- leaving out ordered outcomes such as $(2,5)$ after counting $(5,2)$
- giving a probability below $0$ or above $1$
- using the formula without checking equally likely outcomes

## Board tips

- Write the sample space when it is small.
- State favourable and total counts before forming the fraction.
- Use complements when "not" is easier to count.

## Quick practice

1. Find the probability of an even number on one fair die.
2. Find the probability of at least one head when two different fair coins are tossed.
3. Find the probability of not drawing an ace from a deck.

## Answer check

1. $3/6=1/2$.
2. Outcomes are HH, HT, TH, TT; probability $=3/4$.
3. $1-4/52=12/13$.

## One-minute revision

List all equally likely outcomes, count the favourable ones once, and check that the fraction lies from $0$ to $1$.

## Comic recap

- Sample space: "List every possible elementary outcome."
- Event: "Circle only the outcomes I need."
- Probability: "Favourable divided by total."
- Complement: "Use $1-P(E)$ for 'not E'."
