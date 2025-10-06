/**
 * Lineage Tracker - Agent Family Tree & Genealogy
 * Tracks parent-child relationships and evolutionary history
 */

import type { AgentDNA, AgentLineage } from '../../types/index.js';

export interface LineageNode {
  agent: AgentDNA;
  children: string[];
  depth: number;
  birthOrder: number;
}

export interface LineageStats {
  totalAgents: number;
  maxDepth: number;
  totalBranches: number;
  avgChildrenPerAgent: number;
}

/**
 * LineageTracker - Manages agent family trees
 */
export class LineageTracker {
  private lineages: Map<string, AgentLineage> = new Map();
  private nodes: Map<string, LineageNode> = new Map();
  private roots: Set<string> = new Set();
  private birthCounter: number = 0;

  /**
   * Register a new agent in the lineage system
   */
  registerAgent(agent: AgentDNA): AgentLineage {
    const lineage: AgentLineage = {
      agentId: agent.id,
      parentIds: agent.parentIds || [],
      childrenIds: [],
      generation: agent.generation,
      branch: `branch_${agent.generation}_${agent.id.substring(0, 8)}`,
      epigeneticMemory: {
        keyInsights: [],
        learnedPatterns: [],
        avoidedMistakes: [],
      },
    };

    this.lineages.set(agent.id, lineage);

    // Create node
    const depth = agent.parentIds && agent.parentIds.length > 0 
      ? Math.max(...agent.parentIds.map(pid => this.nodes.get(pid)?.depth || 0)) + 1
      : 0;

    const node: LineageNode = {
      agent,
      children: [],
      depth,
      birthOrder: this.birthCounter++,
    };

    this.nodes.set(agent.id, node);

    // Update parent relationships
    if (agent.parentIds && agent.parentIds.length > 0) {
      for (const parentId of agent.parentIds) {
        const parentLineage = this.lineages.get(parentId);
        const parentNode = this.nodes.get(parentId);
        
        if (parentLineage && !parentLineage.childrenIds.includes(agent.id)) {
          parentLineage.childrenIds.push(agent.id);
        }
        
        if (parentNode && !parentNode.children.includes(agent.id)) {
          parentNode.children.push(agent.id);
        }
      }
    } else {
      // Root agent (no parents)
      this.roots.add(agent.id);
    }

    console.log(`📝 Registered agent: ${agent.name} (Generation ${agent.generation})`);
    
    return lineage;
  }

  /**
   * Get lineage information for an agent
   */
  getLineage(agentId: string): AgentLineage | undefined {
    return this.lineages.get(agentId);
  }

  /**
   * Get all ancestors of an agent
   */
  getAncestors(agentId: string): AgentDNA[] {
    const ancestors: AgentDNA[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const lineage = this.lineages.get(id);
      if (!lineage || !lineage.parentIds) return;

      for (const parentId of lineage.parentIds) {
        const parentNode = this.nodes.get(parentId);
        if (parentNode) {
          ancestors.push(parentNode.agent);
          traverse(parentId);
        }
      }
    };

    traverse(agentId);
    return ancestors;
  }

  /**
   * Get all descendants of an agent
   */
  getDescendants(agentId: string): AgentDNA[] {
    const descendants: AgentDNA[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const lineage = this.lineages.get(id);
      if (!lineage) return;

      for (const childId of lineage.childrenIds) {
        const childNode = this.nodes.get(childId);
        if (childNode) {
          descendants.push(childNode.agent);
          traverse(childId);
        }
      }
    };

    traverse(agentId);
    return descendants;
  }

  /**
   * Get siblings (agents with same parents)
   */
  getSiblings(agentId: string): AgentDNA[] {
    const siblings: AgentDNA[] = [];
    const lineage = this.lineages.get(agentId);
    
    if (!lineage || !lineage.parentIds || lineage.parentIds.length === 0) {
      return siblings;
    }

    // Find all agents with same parent
    const parentId = lineage.parentIds[0];
    const parentLineage = this.lineages.get(parentId);
    
    if (!parentLineage) return siblings;

    for (const childId of parentLineage.childrenIds) {
      if (childId !== agentId) {
        const siblingNode = this.nodes.get(childId);
        if (siblingNode) {
          siblings.push(siblingNode.agent);
        }
      }
    }

    return siblings;
  }

  /**
   * Get family tree as hierarchical structure
   */
  getFamilyTree(): any {
    const buildTree = (agentId: string): any => {
      const node = this.nodes.get(agentId);
      if (!node) return null;

      return {
        id: agentId,
        name: node.agent.name,
        generation: node.agent.generation,
        traits: node.agent.traits,
        birthTimestamp: node.agent.birthTimestamp,
        children: node.children.map(childId => buildTree(childId)).filter(Boolean),
      };
    };

    const trees = Array.from(this.roots).map(rootId => buildTree(rootId));
    return trees;
  }

  /**
   * Get lineage statistics
   */
  getStats(): LineageStats {
    const depths = Array.from(this.nodes.values()).map(n => n.depth);
    const childCounts = Array.from(this.nodes.values()).map(n => n.children.length);

    return {
      totalAgents: this.nodes.size,
      maxDepth: depths.length > 0 ? Math.max(...depths) : 0,
      totalBranches: this.roots.size,
      avgChildrenPerAgent: childCounts.length > 0 
        ? childCounts.reduce((sum, c) => sum + c, 0) / childCounts.length 
        : 0,
    };
  }

  /**
   * Export lineage data as JSON
   */
  exportJSON(): string {
    const data = {
      lineages: Array.from(this.lineages.entries()),
      nodes: Array.from(this.nodes.entries()).map(([id, node]) => ({
        id,
        agent: node.agent,
        children: node.children,
        depth: node.depth,
        birthOrder: node.birthOrder,
      })),
      roots: Array.from(this.roots),
      stats: this.getStats(),
      familyTree: this.getFamilyTree(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Clear all lineage data
   */
  clear() {
    this.lineages.clear();
    this.nodes.clear();
    this.roots.clear();
    this.birthCounter = 0;
  }
}
