---
title: 13.1-13.5 Statistics
subject: Mathematics
class_level: 10
chapter: Statistics
chapter_slug: statistics
lesson_number: 1
lesson_slug: core-notes
estimated_minutes: 105
access_level: free
status: ready
source_textbook: textbooks/maths/jemh113.pdf
---

# 13.1-13.5 Statistics

Grouped data hides individual values inside intervals. Mean, mode and median recover three different kinds of "centre" from those groups.

## 13.1 Introduction

You already know ungrouped frequency distributions. This chapter studies mean, mode and median for grouped data and explains when each measure is useful.

## 13.2 Mean of Grouped Data

The class mark of an interval is

$$x_i=\frac{\text{lower limit}+\text{upper limit}}2.$$

### Direct method

$$\bar x=\frac{\sum f_ix_i}{\sum f_i}.$$

### Assumed-mean method

Choose assumed mean $a$ and let $d_i=x_i-a$:

$$\bar x=a+\frac{\sum f_id_i}{\sum f_i}.$$

### Step-deviation method

When all deviations share a convenient factor $h$, let $u_i=(x_i-a)/h$:

$$\bar x=a+h\frac{\sum f_iu_i}{\sum f_i}.$$

All three methods give the same mean. Choose the method that keeps arithmetic simple.

### Table and activity tracker

- Tables 13.1-13.5 develop Example 1 and all three methods.
- Activity 1 checks that shifting class marks by an assumed mean does not change the final mean.
- Tables 13.6-13.7 support Example 2 on female teachers.
- Table 13.8 supports Example 3 on wickets with unequal class sizes.
- Activity 2 asks groups to collect marks, temperatures and heights, form grouped tables, and choose a suitable mean method.

[[demo:math-ch13-grouped-statistics]]

## 13.3 Mode of Grouped Data

The modal class has the highest frequency. For grouped data with continuous, equal-width classes:

$$\text{Mode}=l+\frac{f_1-f_0}{2f_1-f_0-f_2}\times h,$$

where $l$ is the lower limit of the modal class, $h$ its width, $f_1$ its frequency, $f_0$ the preceding frequency, and $f_2$ the succeeding frequency.

Tables 13.9 and the surrounding examples move from ungrouped mode to grouped mode. Examples 4-6 use cricket wickets, family size and marks.

### Activity 3

Using the data collected in Activity 2, each group also finds the mode and compares it with the mean.

## 13.4 Median of Grouped Data

First prepare cumulative frequency. Let $n=\sum f_i$. The median class is the class whose cumulative frequency is just greater than $n/2$.

$$\text{Median}=l+\left(\frac{n/2-cf}{f}\right)h,$$

where $cf$ is the cumulative frequency before the median class and $f$ is the median-class frequency.

### Table tracker

- Tables 13.10-13.11 convert raw frequencies into cumulative frequencies.
- Tables 13.12-13.15 develop less-than and more-than cumulative distributions and the median formula.
- Table 13.16 supports Example 7 on girls' heights.
- Table 13.17 supports Example 8, where median $525$ and total frequency $100$ determine $x$ and $y$.

### Choosing a measure

- Mean uses every observation but can be affected by extremes.
- Median is a useful middle value when extremes distort the mean.
- Mode identifies the most frequent or most popular value.

The textbook records the empirical relation

$$3\text{ Median}=\text{Mode}+2\text{ Mean}.$$

### Note to the Reader

For grouped mode and median, classes must be continuous. Convert inclusive classes when needed. Ogive construction is mentioned as prior knowledge/support, but it is not active board scope here.

## 13.5 Summary

- Mean has direct, assumed-mean and step-deviation forms.
- Mode uses the modal class and its neighbouring frequencies.
- Median uses cumulative frequency and the $n/2$ position.

## Common mistakes

- using a class limit instead of class mark for mean
- choosing the median class by highest frequency
- confusing $cf$ with the cumulative frequency of the median class
- using unequal or non-continuous class widths without correction

## Board tips

- Draw a complete working table with totals.
- State the modal or median class before substituting.
- Keep $l,h,f,cf,f_0,f_1,f_2$ clearly labelled.

## Quick practice

1. Find the class mark of $20$-$30$.
2. If $n=50$, which cumulative-frequency target locates the median class?
3. Which class is modal when the frequencies are $4,9,12,7$?

## Answer check

1. $25$.
2. $n/2=25$; take the class whose cumulative frequency first exceeds $25$.
3. The third class, with frequency $12$.

## One-minute revision

Mean uses $f_ix_i$. Mode uses the tallest frequency and its neighbours. Median uses cumulative frequency around $n/2$.

## Comic recap

- Mean: "I use every class mark."
- Mode: "Find my highest-frequency class."
- Median: "Find where cumulative frequency crosses $n/2$."
- Method chooser: "Pick the centre that suits the question."
