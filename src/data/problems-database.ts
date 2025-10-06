/**
 * Problem Database - Curated coding challenges
 */

import type { CodingProblem } from '../types/arena.js';
import { parseProblem, createTestCase } from '../core/arena/problem-parser.js';

/**
 * Seed problems database
 */
export const PROBLEMS_DATABASE: CodingProblem[] = [
  // ===== EASY PROBLEMS =====
  parseProblem({
    id: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'easy',
    category: ['arrays', 'hash-table'],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists',
    ],
    examples: [
      {
        input: '[2,7,11,15], 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]',
      },
      {
        input: '[3,2,4], 6',
        output: '[1,2]',
      },
      {
        input: '[3,3], 6',
        output: '[0,1]',
      },
    ],
    testCases: [
      createTestCase('[[2,7,11,15], 9]', '[0,1]'),
      createTestCase('[[3,2,4], 6]', '[1,2]'),
      createTestCase('[[3,3], 6]', '[0,1]'),
      createTestCase('[[-1,-2,-3,-4,-5], -8]', '[2,4]', { isHidden: true }),
      createTestCase('[[0,4,3,0], 0]', '[0,3]', { isHidden: true }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['array', 'hash-map', 'two-pointers'],
    difficulty_rating: 2,
  }),

  parseProblem({
    id: 'reverse-string',
    title: 'Reverse String',
    description: `Write a function that reverses a string. The input string is given as an array of characters.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: 'easy',
    category: ['string', 'two-pointers'],
    examples: [
      {
        input: '["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: '["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    testCases: [
      createTestCase('[["h","e","l","l","o"]]', '["o","l","l","e","h"]'),
      createTestCase('[["H","a","n","n","a","h"]]', '["h","a","n","n","a","H"]'),
      createTestCase('[["a"]]', '["a"]'),
      createTestCase('[["a","b"]]', '["b","a"]', { isHidden: true }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['string', 'two-pointers', 'in-place'],
    difficulty_rating: 1,
  }),

  parseProblem({
    id: 'fizz-buzz',
    title: 'Fizz Buzz',
    description: `Given an integer n, return a string array answer (1-indexed) where:

- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
- answer[i] == "Fizz" if i is divisible by 3.
- answer[i] == "Buzz" if i is divisible by 5.
- answer[i] == i (as a string) if none of the above conditions are true.`,
    difficulty: 'easy',
    category: ['math', 'string'],
    examples: [
      {
        input: '3',
        output: '["1","2","Fizz"]',
      },
      {
        input: '5',
        output: '["1","2","Fizz","4","Buzz"]',
      },
      {
        input: '15',
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
      },
    ],
    testCases: [
      createTestCase('[3]', '["1","2","Fizz"]'),
      createTestCase('[5]', '["1","2","Fizz","4","Buzz"]'),
      createTestCase('[15]', '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'),
      createTestCase('[1]', '["1"]', { isHidden: true }),
      createTestCase('[30]', '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16","17","Fizz","19","Buzz","Fizz","22","23","Fizz","Buzz","26","Fizz","28","29","FizzBuzz"]', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['math', 'string', 'simulation'],
    difficulty_rating: 1,
  }),

  // ===== MEDIUM PROBLEMS =====
  parseProblem({
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    difficulty: 'medium',
    category: ['string', 'sliding-window', 'hash-table'],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces',
    ],
    examples: [
      {
        input: '"abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3',
      },
      {
        input: '"bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1',
      },
      {
        input: '"pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3',
      },
    ],
    testCases: [
      createTestCase('["abcabcbb"]', '3'),
      createTestCase('["bbbbb"]', '1'),
      createTestCase('["pwwkew"]', '3'),
      createTestCase('[""]', '0', { isHidden: true }),
      createTestCase('["dvdf"]', '3', { isHidden: true }),
      createTestCase('["abcdefghijklmnopqrstuvwxyz"]', '26', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['hash-table', 'string', 'sliding-window'],
    difficulty_rating: 5,
  }),

  parseProblem({
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'easy',
    category: ['string', 'stack'],
    examples: [
      {
        input: '"()"',
        output: 'true',
      },
      {
        input: '"()[]{}"',
        output: 'true',
      },
      {
        input: '"(]"',
        output: 'false',
      },
    ],
    testCases: [
      createTestCase('["()"]', 'true'),
      createTestCase('["()[]{}"]', 'true'),
      createTestCase('["(]"]', 'false'),
      createTestCase('["([)]"]', 'false'),
      createTestCase('["{[]}"]', 'true'),
      createTestCase('[""]', 'true', { isHidden: true }),
      createTestCase('["(((((((((("]', 'false', { isHidden: true }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['string', 'stack', 'validation'],
    difficulty_rating: 3,
  }),

  parseProblem({
    id: 'merge-intervals',
    title: 'Merge Intervals',
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    difficulty: 'medium',
    category: ['array', 'sorting'],
    examples: [
      {
        input: '[[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6]',
      },
      {
        input: '[[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping',
      },
    ],
    testCases: [
      createTestCase('[[[1,3],[2,6],[8,10],[15,18]]]', '[[1,6],[8,10],[15,18]]'),
      createTestCase('[[[1,4],[4,5]]]', '[[1,5]]'),
      createTestCase('[[[1,4],[0,4]]]', '[[0,4]]', { isHidden: true }),
      createTestCase('[[[1,4],[2,3]]]', '[[1,4]]', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['array', 'sorting', 'intervals'],
    difficulty_rating: 6,
  }),

  // ===== HARD PROBLEMS =====
  parseProblem({
    id: 'median-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    difficulty: 'hard',
    category: ['array', 'binary-search', 'divide-and-conquer'],
    examples: [
      {
        input: '[1,3], [2]',
        output: '2.0',
        explanation: 'merged array = [1,2,3] and median is 2',
      },
      {
        input: '[1,2], [3,4]',
        output: '2.5',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5',
      },
    ],
    testCases: [
      createTestCase('[[1,3], [2]]', '2.0'),
      createTestCase('[[1,2], [3,4]]', '2.5'),
      createTestCase('[[0,0], [0,0]]', '0.0', { isHidden: true }),
      createTestCase('[[1], [2,3,4,5,6]]', '3.5', { isHidden: true, weight: 3 }),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['array', 'binary-search', 'divide-and-conquer'],
    difficulty_rating: 9,
  }),

  parseProblem({
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    difficulty: 'hard',
    category: ['array', 'two-pointers', 'dynamic-programming', 'stack'],
    examples: [
      {
        input: '[0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map (black) traps 6 units of water (blue)',
      },
      {
        input: '[4,2,0,3,2,5]',
        output: '9',
      },
    ],
    testCases: [
      createTestCase('[[0,1,0,2,1,0,1,3,2,1,2,1]]', '6'),
      createTestCase('[[4,2,0,3,2,5]]', '9'),
      createTestCase('[[0,0,0]]', '0', { isHidden: true }),
      createTestCase('[[5,4,3,2,1]]', '0', { isHidden: true }),
      createTestCase('[[3,0,2,0,4]]', '7', { isHidden: true, weight: 3 }),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['array', 'two-pointers', 'dynamic-programming', 'stack', 'monotonic-stack'],
    difficulty_rating: 10,
  }),

  // ===== CLASSIC ALGORITHMS =====
  parseProblem({
    id: 'binary-search',
    title: 'Binary Search',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    difficulty: 'easy',
    category: ['array', 'binary-search'],
    examples: [
      {
        input: '[-1,0,3,5,9,12], 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4',
      },
      {
        input: '[-1,0,3,5,9,12], 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1',
      },
    ],
    testCases: [
      createTestCase('[[-1,0,3,5,9,12], 9]', '4'),
      createTestCase('[[-1,0,3,5,9,12], 2]', '-1'),
      createTestCase('[[5], 5]', '0'),
      createTestCase('[[1,2,3,4,5,6,7,8,9,10], 1]', '0', { isHidden: true }),
      createTestCase('[[1,2,3,4,5,6,7,8,9,10], 10]', '9', { isHidden: true }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['array', 'binary-search'],
    difficulty_rating: 2,
  }),

  parseProblem({
    id: 'palindrome-number',
    title: 'Palindrome Number',
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

A palindrome number is a number that reads the same backward as forward.`,
    difficulty: 'easy',
    category: ['math'],
    examples: [
      {
        input: '121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left',
      },
      {
        input: '-121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-',
      },
      {
        input: '10',
        output: 'false',
        explanation: 'Reads 01 from right to left',
      },
    ],
    testCases: [
      createTestCase('[121]', 'true'),
      createTestCase('[-121]', 'false'),
      createTestCase('[10]', 'false'),
      createTestCase('[0]', 'true'),
      createTestCase('[12321]', 'true', { isHidden: true }),
      createTestCase('[123456789]', 'false', { isHidden: true }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['math', 'palindrome'],
    difficulty_rating: 2,
  }),

  parseProblem({
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    difficulty: 'easy',
    category: ['dynamic-programming', 'math'],
    examples: [
      {
        input: '2',
        output: '2',
        explanation: 'There are two ways to climb: 1. 1 step + 1 step  2. 2 steps',
      },
      {
        input: '3',
        output: '3',
        explanation: 'There are three ways: 1. 1+1+1  2. 1+2  3. 2+1',
      },
    ],
    testCases: [
      createTestCase('[2]', '2'),
      createTestCase('[3]', '3'),
      createTestCase('[1]', '1'),
      createTestCase('[5]', '8', { isHidden: true }),
      createTestCase('[10]', '89', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['dynamic-programming', 'memoization', 'math'],
    difficulty_rating: 2,
  }),

  parseProblem({
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    difficulty: 'medium',
    category: ['array', 'dynamic-programming'],
    examples: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6',
      },
      {
        input: '[1]',
        output: '1',
      },
      {
        input: '[5,4,-1,7,8]',
        output: '23',
      },
    ],
    testCases: [
      createTestCase('[[-2,1,-3,4,-1,2,1,-5,4]]', '6'),
      createTestCase('[[1]]', '1'),
      createTestCase('[[5,4,-1,7,8]]', '23'),
      createTestCase('[[-1,-2,-3]]', '-1', { isHidden: true }),
      createTestCase('[[1,2,3,4,5]]', '15', { isHidden: true }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['array', 'divide-and-conquer', 'dynamic-programming'],
    difficulty_rating: 5,
  }),

  parseProblem({
    id: 'add-two-numbers',
    title: 'Add Two Numbers (Linked List)',
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

For this problem, represent linked list as array: [2,4,3] means 2->4->3`,
    difficulty: 'medium',
    category: ['linked-list', 'math', 'recursion'],
    examples: [
      {
        input: '[2,4,3], [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807',
      },
      {
        input: '[0], [0]',
        output: '[0]',
      },
      {
        input: '[9,9,9], [9,9,9,9]',
        output: '[8,9,9,0,1]',
      },
    ],
    testCases: [
      createTestCase('[[2,4,3], [5,6,4]]', '[7,0,8]'),
      createTestCase('[[0], [0]]', '[0]'),
      createTestCase('[[9,9,9], [9,9,9,9]]', '[8,9,9,0,1]'),
      createTestCase('[[1,8], [0]]', '[1,8]', { isHidden: true }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['linked-list', 'math', 'recursion'],
    difficulty_rating: 5,
  }),

  parseProblem({
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    difficulty: 'easy',
    category: ['array', 'hash-table'],
    examples: [
      {
        input: '[1,2,3,1]',
        output: 'true',
      },
      {
        input: '[1,2,3,4]',
        output: 'false',
      },
      {
        input: '[1,1,1,3,3,4,3,2,4,2]',
        output: 'true',
      },
    ],
    testCases: [
      createTestCase('[[1,2,3,1]]', 'true'),
      createTestCase('[[1,2,3,4]]', 'false'),
      createTestCase('[[1,1,1,3,3,4,3,2,4,2]]', 'true'),
      createTestCase('[[]]', 'false', { isHidden: true }),
      createTestCase('[[1]]', 'false', { isHidden: true }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['array', 'hash-table', 'sorting'],
    difficulty_rating: 1,
  }),

  parseProblem({
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    difficulty: 'easy',
    category: ['array', 'dynamic-programming'],
    examples: [
      {
        input: '[7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5',
      },
      {
        input: '[7,6,4,3,1]',
        output: '0',
        explanation: 'No profit can be made',
      },
    ],
    testCases: [
      createTestCase('[[7,1,5,3,6,4]]', '5'),
      createTestCase('[[7,6,4,3,1]]', '0'),
      createTestCase('[[2,4,1]]', '2'),
      createTestCase('[[3,2,6,5,0,3]]', '4', { isHidden: true }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['array', 'dynamic-programming'],
    difficulty_rating: 3,
  }),

  parseProblem({
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.`,
    difficulty: 'medium',
    category: ['array', 'prefix-sum'],
    examples: [
      {
        input: '[1,2,3,4]',
        output: '[24,12,8,6]',
      },
      {
        input: '[-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
      },
    ],
    testCases: [
      createTestCase('[[1,2,3,4]]', '[24,12,8,6]'),
      createTestCase('[[-1,1,0,-3,3]]', '[0,0,9,0,0]'),
      createTestCase('[[2,3]]', '[3,2]', { isHidden: true }),
      createTestCase('[[1,1,1,1]]', '[1,1,1,1]', { isHidden: true }),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['array', 'prefix-sum'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'find-minimum-rotated',
    title: 'Find Minimum in Rotated Sorted Array',
    description: `Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:

[4,5,6,7,0,1,2] if it was rotated 4 times.
[0,1,2,4,5,6,7] if it was rotated 7 times.

Given the rotated array nums of unique elements, return the minimum element of this array.

You must write an algorithm that runs in O(log n) time.`,
    difficulty: 'medium',
    category: ['array', 'binary-search'],
    examples: [
      {
        input: '[3,4,5,1,2]',
        output: '1',
      },
      {
        input: '[4,5,6,7,0,1,2]',
        output: '0',
      },
      {
        input: '[11,13,15,17]',
        output: '11',
      },
    ],
    testCases: [
      createTestCase('[[3,4,5,1,2]]', '1'),
      createTestCase('[[4,5,6,7,0,1,2]]', '0'),
      createTestCase('[[11,13,15,17]]', '11'),
      createTestCase('[[2,1]]', '1', { isHidden: true }),
      createTestCase('[[1]]', '1', { isHidden: true }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['array', 'binary-search'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

For this problem, represent linked list as array: [1,2,3,4,5] means 1->2->3->4->5`,
    difficulty: 'easy',
    category: ['linked-list', 'recursion'],
    examples: [
      {
        input: '[1,2,3,4,5]',
        output: '[5,4,3,2,1]',
      },
      {
        input: '[1,2]',
        output: '[2,1]',
      },
      {
        input: '[]',
        output: '[]',
      },
    ],
    testCases: [
      createTestCase('[[1,2,3,4,5]]', '[5,4,3,2,1]'),
      createTestCase('[[1,2]]', '[2,1]'),
      createTestCase('[[]]', '[]'),
      createTestCase('[[1]]', '[1]', { isHidden: true }),
    ],
    timeLimit: 2000,
    memoryLimit: 64,
    tags: ['linked-list', 'recursion'],
    difficulty_rating: 3,
  }),

  parseProblem({
    id: 'group-anagrams',
    title: 'Group Anagrams',
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    difficulty: 'medium',
    category: ['array', 'hash-table', 'string', 'sorting'],
    examples: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      {
        input: '[""]',
        output: '[[""]]',
      },
      {
        input: '["a"]',
        output: '[["a"]]',
      },
    ],
    testCases: [
      createTestCase('[["eat","tea","tan","ate","nat","bat"]]', '[["bat"],["nat","tan"],["ate","eat","tea"]]'),
      createTestCase('[[""]]]', '[[""]]'),
      createTestCase('[["a"]]', '[["a"]]'),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['array', 'hash-table', 'string', 'sorting'],
    difficulty_rating: 5,
  }),

  parseProblem({
    id: 'longest-palindrome',
    title: 'Longest Palindromic Substring',
    description: `Given a string s, return the longest palindromic substring in s.`,
    difficulty: 'medium',
    category: ['string', 'dynamic-programming'],
    examples: [
      {
        input: '"babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer',
      },
      {
        input: '"cbbd"',
        output: '"bb"',
      },
    ],
    testCases: [
      createTestCase('["babad"]', '"bab"'),
      createTestCase('["cbbd"]', '"bb"'),
      createTestCase('["a"]', '"a"'),
      createTestCase('["ac"]', '"a"', { isHidden: true }),
      createTestCase('["racecar"]', '"racecar"', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['string', 'dynamic-programming'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'container-most-water',
    title: 'Container With Most Water',
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    difficulty: 'medium',
    category: ['array', 'two-pointers', 'greedy'],
    examples: [
      {
        input: '[1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The vertical lines are at indices 1 and 8, with heights 8 and 7',
      },
      {
        input: '[1,1]',
        output: '1',
      },
    ],
    testCases: [
      createTestCase('[[1,8,6,2,5,4,8,3,7]]', '49'),
      createTestCase('[[1,1]]', '1'),
      createTestCase('[[4,3,2,1,4]]', '16', { isHidden: true }),
      createTestCase('[[1,2,1]]', '2', { isHidden: true }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['array', 'two-pointers', 'greedy'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'number-of-islands',
    title: 'Number of Islands',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    difficulty: 'medium',
    category: ['array', 'depth-first-search', 'breadth-first-search', 'matrix'],
    examples: [
      {
        input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
      },
      {
        input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
      },
    ],
    testCases: [
      createTestCase('[[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]]', '1'),
      createTestCase('[[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]]', '3'),
      createTestCase('[[["1"]]]', '1', { isHidden: true }),
      createTestCase('[[["0"]]]', '0', { isHidden: true }),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['array', 'depth-first-search', 'breadth-first-search', 'union-find', 'matrix'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'word-search',
    title: 'Word Search',
    description: `Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    difficulty: 'medium',
    category: ['array', 'backtracking', 'matrix'],
    examples: [
      {
        input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"',
        output: 'true',
      },
      {
        input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"',
        output: 'true',
      },
      {
        input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"',
        output: 'false',
      },
    ],
    testCases: [
      createTestCase('[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"]', 'true'),
      createTestCase('[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"]', 'true'),
      createTestCase('[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"]', 'false'),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['array', 'backtracking', 'matrix'],
    difficulty_rating: 7,
  }),

  parseProblem({
    id: 'permutations',
    title: 'Permutations',
    description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    difficulty: 'medium',
    category: ['array', 'backtracking'],
    examples: [
      {
        input: '[1,2,3]',
        output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      },
      {
        input: '[0,1]',
        output: '[[0,1],[1,0]]',
      },
      {
        input: '[1]',
        output: '[[1]]',
      },
    ],
    testCases: [
      createTestCase('[[1,2,3]]', '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'),
      createTestCase('[[0,1]]', '[[0,1],[1,0]]'),
      createTestCase('[[1]]', '[[1]]'),
    ],
    timeLimit: 4000,
    memoryLimit: 256,
    tags: ['array', 'backtracking'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'coin-change',
    title: 'Coin Change',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    difficulty: 'medium',
    category: ['array', 'dynamic-programming', 'breadth-first-search'],
    examples: [
      {
        input: '[1,2,5], 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1',
      },
      {
        input: '[2], 3',
        output: '-1',
      },
      {
        input: '[1], 0',
        output: '0',
      },
    ],
    testCases: [
      createTestCase('[[1,2,5], 11]', '3'),
      createTestCase('[[2], 3]', '-1'),
      createTestCase('[[1], 0]', '0'),
      createTestCase('[[1,2,5], 100]', '20', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['array', 'dynamic-programming', 'breadth-first-search'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'house-robber',
    title: 'House Robber',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    difficulty: 'medium',
    category: ['array', 'dynamic-programming'],
    examples: [
      {
        input: '[1,2,3,1]',
        output: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4',
      },
      {
        input: '[2,7,9,3,1]',
        output: '12',
        explanation: 'Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total = 2 + 9 + 1 = 12',
      },
    ],
    testCases: [
      createTestCase('[[1,2,3,1]]', '4'),
      createTestCase('[[2,7,9,3,1]]', '12'),
      createTestCase('[[2,1,1,2]]', '4', { isHidden: true }),
      createTestCase('[[5,3,4,11,2]]', '16', { isHidden: true }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['array', 'dynamic-programming'],
    difficulty_rating: 5,
  }),

  parseProblem({
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    description: `Given an integer array nums, return the length of the longest strictly increasing subsequence.`,
    difficulty: 'medium',
    category: ['array', 'binary-search', 'dynamic-programming'],
    examples: [
      {
        input: '[10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4',
      },
      {
        input: '[0,1,0,3,2,3]',
        output: '4',
      },
      {
        input: '[7,7,7,7,7,7,7]',
        output: '1',
      },
    ],
    testCases: [
      createTestCase('[[10,9,2,5,3,7,101,18]]', '4'),
      createTestCase('[[0,1,0,3,2,3]]', '4'),
      createTestCase('[[7,7,7,7,7,7,7]]', '1'),
      createTestCase('[[1,3,6,7,9,4,10,5,6]]', '6', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['array', 'binary-search', 'dynamic-programming'],
    difficulty_rating: 7,
  }),

  parseProblem({
    id: 'unique-paths',
    title: 'Unique Paths',
    description: `There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.

Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.`,
    difficulty: 'medium',
    category: ['math', 'dynamic-programming', 'combinatorics'],
    examples: [
      {
        input: '3, 7',
        output: '28',
      },
      {
        input: '3, 2',
        output: '3',
        explanation: 'From the top-left corner, there are a total of 3 ways to reach the bottom-right corner: 1. Right -> Down -> Down  2. Down -> Down -> Right  3. Down -> Right -> Down',
      },
    ],
    testCases: [
      createTestCase('[3, 7]', '28'),
      createTestCase('[3, 2]', '3'),
      createTestCase('[1, 1]', '1'),
      createTestCase('[10, 10]', '48620', { isHidden: true, weight: 3 }),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
    tags: ['math', 'dynamic-programming', 'combinatorics'],
    difficulty_rating: 5,
  }),

  parseProblem({
    id: 'min-path-sum',
    title: 'Minimum Path Sum',
    description: `Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

Note: You can only move either down or right at any point in time.`,
    difficulty: 'medium',
    category: ['array', 'dynamic-programming', 'matrix'],
    examples: [
      {
        input: '[[1,3,1],[1,5,1],[4,2,1]]',
        output: '7',
        explanation: 'The path 1 → 3 → 1 → 1 → 1 minimizes the sum',
      },
      {
        input: '[[1,2,3],[4,5,6]]',
        output: '12',
      },
    ],
    testCases: [
      createTestCase('[[[1,3,1],[1,5,1],[4,2,1]]]', '7'),
      createTestCase('[[[1,2,3],[4,5,6]]]', '12'),
      createTestCase('[[[1,2],[1,1]]]', '3', { isHidden: true }),
    ],
    timeLimit: 4000,
    memoryLimit: 256,
    tags: ['array', 'dynamic-programming', 'matrix'],
    difficulty_rating: 6,
  }),

  // ===== HARD PROBLEMS (MORE) =====
  parseProblem({
    id: 'regular-expression',
    title: 'Regular Expression Matching',
    description: `Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:

'.' Matches any single character.
'*' Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).`,
    difficulty: 'hard',
    category: ['string', 'dynamic-programming', 'recursion'],
    examples: [
      {
        input: '"aa", "a"',
        output: 'false',
        explanation: '"a" does not match the entire string "aa"',
      },
      {
        input: '"aa", "a*"',
        output: 'true',
        explanation: '\'*\' means zero or more of the preceding element, \'a\'. Therefore, by repeating \'a\' once, it becomes "aa"',
      },
      {
        input: '"ab", ".*"',
        output: 'true',
        explanation: '".*" means "zero or more (*) of any character (.)"',
      },
    ],
    testCases: [
      createTestCase('["aa", "a"]', 'false'),
      createTestCase('["aa", "a*"]', 'true'),
      createTestCase('["ab", ".*"]', 'true'),
      createTestCase('["mississippi", "mis*is*p*."]', 'false', { isHidden: true }),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['string', 'dynamic-programming', 'recursion'],
    difficulty_rating: 10,
  }),

  parseProblem({
    id: 'largest-rectangle',
    title: 'Largest Rectangle in Histogram',
    description: `Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.`,
    difficulty: 'hard',
    category: ['array', 'stack', 'monotonic-stack'],
    examples: [
      {
        input: '[2,1,5,6,2,3]',
        output: '10',
        explanation: 'The largest rectangle has area = 10 units (bars at index 2 and 3)',
      },
      {
        input: '[2,4]',
        output: '4',
      },
    ],
    testCases: [
      createTestCase('[[2,1,5,6,2,3]]', '10'),
      createTestCase('[[2,4]]', '4'),
      createTestCase('[[1]]', '1', { isHidden: true }),
      createTestCase('[[2,2,2,2,2]]', '10', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['array', 'stack', 'monotonic-stack'],
    difficulty_rating: 9,
  }),

  parseProblem({
    id: 'word-ladder',
    title: 'Word Ladder',
    description: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

Every adjacent pair of words differs by a single letter.
Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.`,
    difficulty: 'hard',
    category: ['hash-table', 'string', 'breadth-first-search'],
    examples: [
      {
        input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long',
      },
      {
        input: '"hit", "cog", ["hot","dot","dog","lot","log"]',
        output: '0',
        explanation: 'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence',
      },
    ],
    testCases: [
      createTestCase('["hit", "cog", ["hot","dot","dog","lot","log","cog"]]', '5'),
      createTestCase('["hit", "cog", ["hot","dot","dog","lot","log"]]', '0'),
    ],
    timeLimit: 6000,
    memoryLimit: 256,
    tags: ['hash-table', 'string', 'breadth-first-search'],
    difficulty_rating: 9,
  }),

  parseProblem({
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    description: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
    difficulty: 'hard',
    category: ['array', 'queue', 'sliding-window', 'heap', 'monotonic-queue'],
    examples: [
      {
        input: '[1,3,-1,-3,5,3,6,7], 3',
        output: '[3,3,5,5,6,7]',
        explanation: `Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7`,
      },
      {
        input: '[1], 1',
        output: '[1]',
      },
    ],
    testCases: [
      createTestCase('[[1,3,-1,-3,5,3,6,7], 3]', '[3,3,5,5,6,7]'),
      createTestCase('[[1], 1]', '[1]'),
      createTestCase('[[1,3,1,2,0,5], 3]', '[3,3,2,5]', { isHidden: true, weight: 2 }),
    ],
    timeLimit: 6000,
    memoryLimit: 256,
    tags: ['array', 'queue', 'sliding-window', 'heap', 'monotonic-queue'],
    difficulty_rating: 9,
  }),

  parseProblem({
    id: 'serialize-deserialize-tree',
    title: 'Serialize and Deserialize Binary Tree',
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

For this problem, represent tree as array (level-order): [1,2,3,null,null,4,5] means:
    1
   / \\
  2   3
     / \\
    4   5`,
    difficulty: 'hard',
    category: ['string', 'tree', 'depth-first-search', 'breadth-first-search', 'design'],
    examples: [
      {
        input: '[1,2,3,null,null,4,5]',
        output: '[1,2,3,null,null,4,5]',
        explanation: 'After serialization and deserialization, the tree structure remains the same',
      },
      {
        input: '[]',
        output: '[]',
      },
    ],
    testCases: [
      createTestCase('[[1,2,3,null,null,4,5]]', '[1,2,3,null,null,4,5]'),
      createTestCase('[[]]', '[]'),
      createTestCase('[[1]]', '[1]', { isHidden: true }),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['string', 'tree', 'depth-first-search', 'breadth-first-search', 'binary-tree', 'design'],
    difficulty_rating: 9,
  }),

  parseProblem({
    id: 'lru-cache',
    title: 'LRU Cache',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
- int get(int key) Return the value of the key if the key exists, otherwise return -1.
- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions get and put must each run in O(1) average time complexity.`,
    difficulty: 'medium',
    category: ['hash-table', 'linked-list', 'design'],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: `LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4`,
      },
    ],
    testCases: [
      createTestCase('[["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]]', '[null, null, null, 1, null, -1, null, -1, 3, 4]'),
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    tags: ['hash-table', 'linked-list', 'design', 'doubly-linked-list'],
    difficulty_rating: 7,
  }),

  parseProblem({
    id: 'course-schedule',
    title: 'Course Schedule',
    description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return true if you can finish all courses. Otherwise, return false.`,
    difficulty: 'medium',
    category: ['depth-first-search', 'breadth-first-search', 'graph', 'topological-sort'],
    examples: [
      {
        input: '2, [[1,0]]',
        output: 'true',
        explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible',
      },
      {
        input: '2, [[1,0],[0,1]]',
        output: 'false',
        explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible',
      },
    ],
    testCases: [
      createTestCase('[2, [[1,0]]]', 'true'),
      createTestCase('[2, [[1,0],[0,1]]]', 'false'),
      createTestCase('[1, []]', 'true', { isHidden: true }),
      createTestCase('[4, [[1,0],[2,0],[3,1],[3,2]]]', 'true', { isHidden: true }),
    ],
    timeLimit: 4000,
    memoryLimit: 128,
    tags: ['depth-first-search', 'breadth-first-search', 'graph', 'topological-sort'],
    difficulty_rating: 6,
  }),

  parseProblem({
    id: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    description: `A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

Implement the Trie class:
- Trie() Initializes the trie object.
- void insert(String word) Inserts the string word into the trie.
- boolean search(String word) Returns true if the string word is in the trie (i.e., was inserted before), and false otherwise.
- boolean startsWith(String prefix) Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.`,
    difficulty: 'medium',
    category: ['hash-table', 'string', 'design', 'trie'],
    examples: [
      {
        input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
        output: '[null, null, true, false, true, null, true]',
        explanation: `Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // return True
trie.search("app");     // return False
trie.startsWith("app"); // return True
trie.insert("app");
trie.search("app");     // return True`,
      },
    ],
    testCases: [
      createTestCase('[["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]]', '[null, null, true, false, true, null, true]'),
    ],
    timeLimit: 4000,
    memoryLimit: 256,
    tags: ['hash-table', 'string', 'design', 'trie'],
    difficulty_rating: 6,
  }),
];

/**
 * Get problems by difficulty
 */
export function getProblemsByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'expert') {
  return PROBLEMS_DATABASE.filter(p => p.difficulty === difficulty);
}

/**
 * Get problems by category
 */
export function getProblemsByCategory(category: string) {
  return PROBLEMS_DATABASE.filter(p => p.category.includes(category));
}

/**
 * Get problem by ID
 */
export function getProblemById(id: string) {
  return PROBLEMS_DATABASE.find(p => p.id === id);
}

/**
 * Get random problem
 */
export function getRandomProblem(difficulty?: 'easy' | 'medium' | 'hard' | 'expert') {
  const pool = difficulty 
    ? getProblemsByDifficulty(difficulty)
    : PROBLEMS_DATABASE;
  
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get problems for tournament (balanced difficulty)
 */
export function getTournamentProblems(count: number = 5) {
  const easy = getProblemsByDifficulty('easy');
  const medium = getProblemsByDifficulty('medium');
  const hard = getProblemsByDifficulty('hard');
  
  const problems: CodingProblem[] = [];
  
  // 40% easy, 40% medium, 20% hard
  const easyCount = Math.ceil(count * 0.4);
  const mediumCount = Math.ceil(count * 0.4);
  const hardCount = count - easyCount - mediumCount;
  
  for (let i = 0; i < easyCount && i < easy.length; i++) {
    problems.push(easy[Math.floor(Math.random() * easy.length)]);
  }
  
  for (let i = 0; i < mediumCount && i < medium.length; i++) {
    problems.push(medium[Math.floor(Math.random() * medium.length)]);
  }
  
  for (let i = 0; i < hardCount && i < hard.length; i++) {
    problems.push(hard[Math.floor(Math.random() * hard.length)]);
  }
  
  return problems;
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  PROBLEMS_DATABASE.forEach(p => {
    p.category.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
}

/**
 * Database statistics
 */
export function getDatabaseStats() {
  return {
    total: PROBLEMS_DATABASE.length,
    easy: getProblemsByDifficulty('easy').length,
    medium: getProblemsByDifficulty('medium').length,
    hard: getProblemsByDifficulty('hard').length,
    expert: getProblemsByDifficulty('expert').length,
    categories: getAllCategories(),
  };
}
