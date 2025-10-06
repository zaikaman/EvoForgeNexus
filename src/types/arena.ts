/**
 * AI Code Evolution Arena - Type Definitions
 * Competitive coding platform with evolutionary AI agents
 */

/**
 * Coding Problem - Challenge for agents to solve
 */
export interface CodingProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string[];                    // ['arrays', 'dynamic-programming', etc.]
  constraints: string[];
  examples: ProblemExample[];
  testCases: TestCase[];
  timeLimit: number;                     // milliseconds
  memoryLimit: number;                   // MB
  starterCode?: Record<string, string>;  // { 'javascript': '...', 'python': '...' }
  tags: string[];
  authorId?: string;
  likes: number;
  difficulty_rating: number;             // 1-10 for ELO calculations
  created_at: number;
}

/**
 * Problem Example - Sample input/output
 */
export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

/**
 * Test Case - Hidden test for validation
 */
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;                     // Public vs private tests
  weight: number;                        // Importance (1-5)
  timeoutMs?: number;
}

/**
 * Coding Agent - Specialized AI for competitive coding
 */
export interface CodingAgent {
  id: string;
  name: string;
  personality: AgentPersonality;
  dna: CodingAgentDNA;
  stats: AgentStats;
  elo: number;
  rank: string;                          // 'Bronze', 'Silver', 'Gold', etc.
  avatar: string;                        // Avatar URL or emoji
  parentIds?: string[];                  // For breeding
  generation: number;
  created_at: number;
  owner_id?: string;                     // User who created/owns agent
}

/**
 * Agent Personality Types
 */
export type AgentPersonality = 
  | 'speed_demon'      // Fast but may be messy
  | 'perfectionist'    // Slow but clean code
  | 'creative'         // Unique approaches
  | 'optimizer'        // Performance-focused
  | 'readable'         // Best practices, maintainability
  | 'hybrid';          // Mixed traits from breeding

/**
 * Coding Agent DNA - Genetic traits
 */
export interface CodingAgentDNA {
  traits: {
    speed: number;                       // 0-1: How fast agent codes
    code_quality: number;                // 0-1: Code cleanliness
    creativity: number;                  // 0-1: Solution uniqueness
    optimization: number;                // 0-1: Performance focus
    readability: number;                 // 0-1: Code maintainability
    debugging: number;                   // 0-1: Error detection skill
  };
  preferred_patterns: string[];          // Design patterns favored
  language_proficiency: Record<string, number>; // { 'javascript': 0.9, ... }
  model: string;                         // LLM model
  prompt_template: string;               // Custom system prompt
  temperature: number;                   // LLM temperature
}

/**
 * Agent Statistics
 */
export interface AgentStats {
  battles_fought: number;
  wins: number;
  losses: number;
  draws: number;
  win_rate: number;
  problems_solved: number;
  average_time: number;                  // Average solve time (ms)
  average_memory: number;                // Average memory usage (MB)
  test_pass_rate: number;                // 0-1
  elegance_score: number;                // Average code quality (0-10)
  best_streak: number;
  current_streak: number;
}

/**
 * Battle - Competition between agents
 */
export interface Battle {
  id: string;
  problem_id: string;
  agents: string[];                      // Agent IDs
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  mode: 'solo' | 'versus' | 'tournament' | 'team';
  started_at?: number;
  completed_at?: number;
  submissions: BattleSubmission[];
  winner_id?: string;
  spectators: number;                    // Live viewer count
  replay_url?: string;
  prize_pool?: number;                   // Virtual credits
}

/**
 * Battle Submission - Agent's solution attempt
 */
export interface BattleSubmission {
  id: string;
  battle_id: string;
  agent_id: string;
  language: string;
  code: string;
  submitted_at: number;
  execution_result: ExecutionResult;
  metrics: SubmissionMetrics;
  rank?: number;                         // Placement in battle
}

/**
 * Execution Result - Test execution outcome
 */
export interface ExecutionResult {
  status: 'running' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 
          'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
  tests_passed: number;
  tests_total: number;
  passed_test_ids: string[];
  failed_test_ids: string[];
  error_message?: string;
  execution_time: number;                // milliseconds
  memory_used: number;                   // MB
  output?: string;
}

/**
 * Submission Metrics - Quality & performance scores
 */
export interface SubmissionMetrics {
  time_score: number;                    // 0-100: Speed performance
  memory_score: number;                  // 0-100: Memory efficiency
  elegance_score: number;                // 0-10: Code quality
  test_score: number;                    // 0-100: Tests passed %
  overall_score: number;                 // Combined weighted score
  penalties: number;                     // Deductions for issues
  bonuses: number;                       // Rewards for excellence
}

/**
 * Live Battle State - Real-time battle info
 */
export interface LiveBattleState {
  battle_id: string;
  current_time: number;
  agents_status: Record<string, AgentBattleStatus>;
  leaderboard: LeaderboardEntry[];
  events: BattleEvent[];
  chat_messages: ChatMessage[];
}

/**
 * Agent Battle Status - Real-time agent state
 */
export interface AgentBattleStatus {
  agent_id: string;
  status: 'thinking' | 'coding' | 'testing' | 'debugging' | 'optimizing' | 'submitted' | 'failed';
  progress: number;                      // 0-100%
  current_approach?: string;             // What strategy agent is trying
  tests_passed: number;
  code_lines: number;
  last_action: string;
  last_action_time: number;
}

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
  rank: number;
  agent_id: string;
  agent_name: string;
  score: number;
  time: number;
  memory: number;
  tests_passed: number;
  elegance: number;
  delta?: number;                        // Change from previous rank
}

/**
 * Battle Event - Real-time battle happening
 */
export interface BattleEvent {
  id: string;
  battle_id: string;
  type: 'agent_start' | 'code_update' | 'test_run' | 'test_pass' | 'test_fail' | 
        'submission' | 'rank_change' | 'battle_end';
  agent_id?: string;
  timestamp: number;
  data: any;
  importance: 'low' | 'medium' | 'high'; // For UI highlighting
}

/**
 * Chat Message - Spectator/agent commentary
 */
export interface ChatMessage {
  id: string;
  battle_id: string;
  sender_type: 'agent' | 'spectator' | 'system';
  sender_id: string;
  sender_name: string;
  message: string;
  timestamp: number;
  reactions?: Record<string, number>;    // emoji: count
}

/**
 * Breeding Request - Create hybrid agent
 */
export interface BreedingRequest {
  parent1_id: string;
  parent2_id: string;
  name?: string;
  trait_weights?: Partial<Record<keyof CodingAgentDNA['traits'], number>>;
  mutation_rate?: number;                // 0-1: How much to mutate
}

/**
 * Breeding Result
 */
export interface BreedingResult {
  child: CodingAgent;
  parent1_contribution: number;          // 0-1
  parent2_contribution: number;          // 0-1
  mutations: string[];                   // List of mutations applied
  predicted_strength: number;            // 0-1: Expected performance
}

/**
 * Tournament - Multi-round competition
 */
export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  problems: string[];                    // Problem IDs
  participants: string[];                // Agent IDs
  current_round: number;
  total_rounds: number;
  matches: Battle[];
  bracket?: TournamentBracket;
  prize_distribution: number[];          // [1st, 2nd, 3rd, ...]
  status: 'registration' | 'in_progress' | 'completed';
  start_time?: number;
  end_time?: number;
}

/**
 * Tournament Bracket Node
 */
export interface TournamentBracket {
  round: number;
  matches: {
    match_id: string;
    agent1_id: string;
    agent2_id: string;
    winner_id?: string;
    next_match_id?: string;
  }[];
}

/**
 * User Profile - Player account
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  created_at: number;
  owned_agents: string[];
  favorite_agents: string[];
  credits: number;                       // Virtual currency
  achievements: Achievement[];
  stats: {
    battles_watched: number;
    agents_created: number;
    tournaments_won: number;
  };
}

/**
 * Achievement
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked_at: number;
}

/**
 * ELO Rating Change
 */
export interface EloChange {
  agent_id: string;
  old_elo: number;
  new_elo: number;
  delta: number;
  reason: string;                        // Battle ID or reason
  timestamp: number;
}

/**
 * Code Analysis - AI feedback on solution
 */
export interface CodeAnalysis {
  submission_id: string;
  time_complexity: string;               // e.g., "O(n log n)"
  space_complexity: string;
  code_smells: string[];
  best_practices: string[];
  suggestions: string[];
  security_issues: string[];
  performance_tips: string[];
  readability_score: number;             // 0-10
  maintainability_score: number;         // 0-10
}

/**
 * Replay Data - For viewing past battles
 */
export interface ReplayData {
  battle_id: string;
  problem: CodingProblem;
  agents: CodingAgent[];
  timeline: ReplayFrame[];
  final_results: BattleSubmission[];
  duration: number;
  highlights: ReplayHighlight[];
}

/**
 * Replay Frame - Snapshot at specific time
 */
export interface ReplayFrame {
  timestamp: number;
  agents_code: Record<string, string>;   // agent_id: current code
  agents_status: Record<string, AgentBattleStatus>;
  events: BattleEvent[];
}

/**
 * Replay Highlight - Key moments
 */
export interface ReplayHighlight {
  timestamp: number;
  type: 'first_solution' | 'clever_trick' | 'dramatic_comeback' | 'close_finish';
  description: string;
  importance: number;                    // 0-10
}

/**
 * Betting - Spectator predictions (virtual currency)
 */
export interface Bet {
  id: string;
  user_id: string;
  battle_id: string;
  agent_id: string;
  amount: number;
  odds: number;
  potential_payout: number;
  status: 'pending' | 'won' | 'lost' | 'refunded';
  placed_at: number;
  resolved_at?: number;
}

/**
 * WebSocket Events - Real-time updates
 */
export type ArenaWebSocketEvent = 
  | { type: 'battle:started'; data: Battle }
  | { type: 'battle:updated'; data: LiveBattleState }
  | { type: 'battle:finished'; data: Battle }
  | { type: 'agent:status_change'; data: AgentBattleStatus }
  | { type: 'code:update'; data: { agent_id: string; code: string } }
  | { type: 'test:result'; data: { agent_id: string; result: ExecutionResult } }
  | { type: 'leaderboard:update'; data: LeaderboardEntry[] }
  | { type: 'chat:message'; data: ChatMessage }
  | { type: 'event'; data: BattleEvent };
