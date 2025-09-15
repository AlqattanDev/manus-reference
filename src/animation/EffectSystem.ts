/**
 * Effect System
 * Handles different visual effects and color schemes for ASCII animations
 */

import type { CanvasParticle, VimMode } from '@/types';
import { COLOR_SCHEMES, EFFECT_NAMES, VIM_MODES } from '@/utils/constants';

export interface EffectContext {
  time: number;
  mousePos: { x: number; y: number };
  isHovering: boolean;
  distance: number;
}

export interface EffectStrategy {
  apply(particle: CanvasParticle, context: EffectContext): void;
}

// Matrix Rain Effect
class MatrixRainEffect implements EffectStrategy {
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    particle.offsetY = Math.sin(time * 0.02 + particle.index * 0.05) * 0.5;
    
    if (isHovering) {
      // Enhanced hover effect with cascading animation
      const cascadeDelay = particle.index * 2;
      const cascadePhase = Math.max(0, time - cascadeDelay) * 0.1;
      particle.offsetX = Math.sin(cascadePhase + particle.index) * 3;
      particle.offsetY += Math.cos(cascadePhase * 0.5) * 1.5;
      
      // Dynamic color transition
      const intensity = Math.sin(cascadePhase) * 0.5 + 0.5;
      particle.color = `hsl(${60 + intensity * 20}, 100%, ${70 + intensity * 20}%)`;
      
      // Character morphing effect
      const matrixChars = ['0', '1', 'ア', 'カ', 'サ', 'タ', 'ナ', 'ハ'];
      if (Math.floor(time / 3) % 2 === 0) {
        particle.char = matrixChars[Math.floor(Math.random() * matrixChars.length)] || particle.originalChar;
      }
    } else {
      particle.color = '#00ff41';
      particle.char = particle.originalChar;
      particle.offsetX *= 0.92;
    }
  }
}

// Blockchain Validation Effect
class BlockchainValidationEffect implements EffectStrategy {
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    if (isHovering) {
      const validationDelay = particle.blockIndex * 8;
      const validationProgress = Math.min(1, Math.max(0, (time - validationDelay) / 30));
      
      if (validationProgress > 0) {
        particle.validated = true;
        
        // Progressive hash generation with visual feedback
        const hashChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        const hashIndex = Math.floor(time / 4 + particle.index) % hashChars.length;
        particle.char = hashChars[hashIndex] || particle.originalChar;
        
        // Color progression from pending to validated
        const hue = 180 + validationProgress * 40; // Blue to teal progression
        const saturation = 80 + validationProgress * 20;
        const lightness = 50 + validationProgress * 30;
        particle.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Validation pulse effect
        const pulseIntensity = Math.sin(time * 0.2 + particle.index * 0.1) * 0.3 + 0.7;
        particle.offsetY = Math.sin(time * 0.1 + validationProgress * Math.PI) * pulseIntensity;
        particle.offsetX = Math.cos(time * 0.08 + particle.index * 0.2) * (validationProgress * 2);
      } else {
        // Pending validation state
        particle.color = `hsl(0, 0%, ${30 + Math.sin(time * 0.1) * 10}%)`;
        particle.offsetY = Math.sin(time * 0.05 + particle.index) * 0.5;
      }
    } else {
      particle.validated = false;
      particle.char = particle.originalChar;
      particle.color = '#ffffff';
      particle.offsetX *= 0.9;
      particle.offsetY *= 0.9;
    }
  }
}

// Trading Effect
class TradingEffect implements EffectStrategy {
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    particle.phase += 0.08;
    
    if (isHovering) {
      // More realistic price movement with momentum
      const volatility = 0.02 + Math.sin(time * 0.01) * 0.01;
      const priceChange = (Math.random() - 0.5) * volatility * particle.trend;
      particle.price = Math.max(0.1, particle.price + priceChange);
      
      // Dynamic trend calculation
      const trendStrength = Math.abs(particle.trend);
      particle.offsetY = Math.sin(particle.phase) * (trendStrength * 3);
      particle.offsetX = Math.cos(particle.phase * 0.7) * (trendStrength * 1.5);
      
      // Enhanced trading symbols with context
      const bullishChars = ['↗', '▲', '⬆', '📈', '+', '$'];
      const bearishChars = ['↘', '▼', '⬇', '📉', '-', '¥'];
      const neutralChars = ['→', '◆', '●', '€', '£', '₿'];
      
      let charSet = neutralChars;
      let baseColor = '#ffaa00';
      
      if (particle.trend > 0.1) {
        charSet = bullishChars;
        baseColor = '#00ff88';
      } else if (particle.trend < -0.1) {
        charSet = bearishChars;
        baseColor = '#ff4444';
      }
      
      // Animate character selection based on price movement intensity
      const intensity = Math.min(1, Math.abs(priceChange) * 100);
      const charIndex = Math.floor(time / 6 + intensity * 3) % charSet.length;
      particle.char = charSet[charIndex] || particle.originalChar;
      
      // Dynamic color based on trend strength and recent movement
      const colorIntensity = 0.7 + intensity * 0.3;
      particle.color = baseColor.replace(/[0-9a-f]{2}/g, (match) => {
        const value = parseInt(match, 16);
        const adjustedValue = Math.floor(value * colorIntensity);
        return adjustedValue.toString(16).padStart(2, '0');
      }) ?? baseColor;
    } else {
      particle.offsetY *= 0.92;
      particle.offsetX *= 0.92;
      particle.char = particle.originalChar;
      particle.color = '#ffffff';
      // Gradually return trend to neutral
      particle.trend *= 0.98;
    }
  }
}

// SWIFT Network Effect - International banking message routing
class SWIFTNetworkEffect implements EffectStrategy {
  private networkNodes: Set<number> = new Set();
  
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    if (isHovering) {
      // Currency symbols for active network
      const currencies = ['₴', '₹', '₽', '¥', '€', '£', '$', '¢'];
      const flows = ['⟷', '⟶', '⟵', '↔', '↕', '⟸', '⟹'];
      const nodes = ['⬢', '⬣', '⬡', '◈', '◇', '◆'];
      
      // Network pulse wave - emanates from random nodes
      const isNode = particle.index % 7 === 0;
      if (isNode) {
        this.networkNodes.add(particle.index);
        particle.char = nodes[Math.floor(time / 10 + particle.index) % nodes.length] || particle.originalChar;
        
        // Pulse effect from nodes
        const pulsePhase = (time * 0.15 + particle.index) % (Math.PI * 2);
        particle.offsetX = Math.cos(pulsePhase) * 2;
        particle.offsetY = Math.sin(pulsePhase) * 1.5;
        
        // Node color progression
        const intensity = (Math.sin(time * 0.1 + particle.index) + 1) * 0.5;
        particle.color = `hsl(${140 + intensity * 20}, 70%, ${60 + intensity * 20}%)`;
      } else {
        // Message routing between nodes
        const routingSpeed = 0.08;
        const routePhase = time * routingSpeed + particle.index * 0.2;
        
        // Use currency symbols for messages in transit
        if (Math.floor(routePhase * 0.5) % 2 === 0) {
          particle.char = currencies[Math.floor(time / 6 + particle.index) % currencies.length] || particle.originalChar;
          
          // Message flow animation
          particle.offsetX = Math.sin(routePhase) * 4;
          particle.offsetY = Math.cos(routePhase * 0.7) * 2;
          
          particle.color = '#96ceb4'; // Mint green for messages
        } else {
          particle.char = flows[Math.floor(time / 8 + particle.index) % flows.length] || particle.originalChar;
          particle.color = '#66a682'; // Darker mint for directional flow
          
          // Directional flow movement
          particle.offsetX = Math.cos(time * 0.06 + particle.index * 0.15) * 3;
          particle.offsetY = Math.sin(time * 0.05 + particle.index * 0.1) * 1;
        }
      }
    } else {
      particle.char = particle.originalChar;
      particle.color = '#96ceb4';
      particle.offsetX *= 0.92;
      particle.offsetY *= 0.92;
    }
  }
}

// Risk Assessment Effect - Dynamic risk visualization
class RiskAssessmentEffect implements EffectStrategy {
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering, distance } = context;
    
    // Calculate dynamic risk score based on position and time
    const riskScore = (Math.sin(time * 0.03 + particle.index * 0.1) + 1) * 0.5;
    const proximityRisk = isHovering ? Math.max(0, 1 - distance / 100) : 0;
    const totalRisk = Math.min(1, riskScore + proximityRisk * 0.5);
    
    if (isHovering) {
      // Risk indicators based on calculated risk
      const lowRisk = ['▁', '▂', '▃', '●', '◐'];
      const mediumRisk = ['▄', '▅', '▆', '⚠', '◑', '◒'];
      const highRisk = ['▇', '█', '▉', '⚡', '◓', '🔴'];
      
      let charSet = lowRisk;
      let baseColor = '#feca57'; // Warning yellow
      
      if (totalRisk > 0.7) {
        charSet = highRisk;
        baseColor = '#ff4757'; // High risk red
      } else if (totalRisk > 0.4) {
        charSet = mediumRisk;
        baseColor = '#ff7675'; // Medium risk orange-red
      }
      
      particle.char = charSet[Math.floor(time / 5 + particle.index + totalRisk * 10) % charSet.length] || particle.originalChar;
      
      // Risk heat map movement - more erratic with higher risk
      const volatility = totalRisk * 2 + 0.5;
      particle.offsetX = Math.sin(time * volatility * 0.1 + particle.index * 0.3) * (totalRisk * 4 + 1);
      particle.offsetY = Math.cos(time * volatility * 0.08 + particle.index * 0.2) * (totalRisk * 3 + 1);
      
      // Dynamic color with risk progression
      const intensity = 0.7 + totalRisk * 0.3;
      particle.color = baseColor;
      
      // Alert propagation - high risk particles affect neighbors
      if (totalRisk > 0.8) {
        const alertPhase = time * 0.2;
        const alert = Math.sin(alertPhase + particle.index) > 0.5;
        if (alert) {
          particle.char = '⚠';
          particle.color = '#ff3838';
        }
      }
    } else {
      particle.char = particle.originalChar;
      particle.color = '#feca57';
      particle.offsetX *= 0.9;
      particle.offsetY *= 0.9;
    }
  }
}

// Compliance Check Effect - Document scanning and validation
class ComplianceCheckEffect implements EffectStrategy {
  private scanLine: number = 0;
  
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    this.scanLine = (time * 2) % 100; // Horizontal scanning line
    
    if (isHovering) {
      const checkmarks = ['✓', '✔', '☑', '✅'];
      const warnings = ['⚠', '❌', '❎', '⛔'];
      const legal = ['§', '¶', '©', '®', '™', '⚖'];
      const status = ['●', '○', '◉', '◎', '⦿', '⦾'];
      
      // Compliance scanning simulation
      const scanProgress = (particle.baseY + time * 0.5) % 60;
      const isBeingScanned = Math.abs(scanProgress - particle.baseY % 60) < 10;
      
      if (isBeingScanned) {
        // Document scanning state
        particle.char = '▓';
        particle.color = '#ff9ff3'; // Bright compliance pink
        
        // Scanning animation
        particle.offsetX = Math.sin(time * 0.3 + particle.index) * 2;
        particle.offsetY = 0; // No vertical movement during scan
        
        // After scan delay, show result
        const scanResult = (particle.index + Math.floor(time / 20)) % 10;
        setTimeout(() => {
          if (scanResult < 7) {
            // Passed compliance
            particle.char = checkmarks[scanResult % checkmarks.length] || particle.originalChar;
            particle.color = '#00ff88'; // Success green
          } else {
            // Failed compliance
            particle.char = warnings[scanResult % warnings.length] || particle.originalChar;
            particle.color = '#ff4444'; // Error red
          }
        }, 500);
      } else {
        // Normal state - show legal symbols
        particle.char = legal[Math.floor(time / 12 + particle.index) % legal.length] || particle.originalChar;
        particle.color = '#cc7ae6'; // Muted compliance purple
        
        // Audit trail movement
        particle.offsetX = Math.cos(time * 0.05 + particle.index * 0.2) * 1.5;
        particle.offsetY = Math.sin(time * 0.04 + particle.index * 0.15) * 1;
      }
    } else {
      particle.char = particle.originalChar;
      particle.color = '#ff9ff3';
      particle.offsetX *= 0.92;
      particle.offsetY *= 0.92;
    }
  }
}

// Trade Settlement Effect - T+2 settlement cycle
class TradeSettlementEffect implements EffectStrategy {
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    if (isHovering) {
      // Settlement symbols
      const settlement = ['⟲', '⟳', '↻', '↺', '⊶', '⊷'];
      const matching = ['⟷', '⟺', '⟿', '⟻', '⤋', '⤊', '⇄'];
      const clearing = ['⊗', '⊙', '⊚', '⦿', '◎', '◉'];
      
      // T+2 settlement cycle (3-day animation cycle)
      const settlementCycle = (time * 0.02 + particle.index * 0.1) % (Math.PI * 6); // 3-day cycle
      const day = Math.floor(settlementCycle / (Math.PI * 2));
      
      switch (day) {
        case 0: // T+0 - Trade execution
          particle.char = matching[Math.floor(time / 8 + particle.index) % matching.length] || particle.originalChar;
          particle.color = '#ff9500'; // Orange for pending
          
          // Trade matching animation - particles seek pairs
          const pairIndex = Math.floor(particle.index / 2) * 2;
          const isPrimaryInPair = particle.index % 2 === 0;
          
          if (isPrimaryInPair) {
            particle.offsetX = Math.sin(time * 0.1 + particle.index) * 3;
            particle.offsetY = Math.cos(time * 0.08 + particle.index) * 2;
          } else {
            // Secondary particle seeks primary
            particle.offsetX = Math.cos(time * 0.1 + pairIndex) * 3;
            particle.offsetY = Math.sin(time * 0.08 + pairIndex) * 2;
          }
          break;
          
        case 1: // T+1 - Clearing
          particle.char = clearing[Math.floor(time / 10 + particle.index) % clearing.length] || particle.originalChar;
          particle.color = '#54a0ff'; // Blue for clearing
          
          // Circular clearing house pattern
          const clearingPhase = time * 0.06 + particle.index * 0.3;
          particle.offsetX = Math.cos(clearingPhase) * 4;
          particle.offsetY = Math.sin(clearingPhase) * 3;
          break;
          
        case 2: // T+2 - Settlement
          particle.char = settlement[Math.floor(time / 12 + particle.index) % settlement.length] || particle.originalChar;
          particle.color = '#00ff88'; // Green for settled
          
          // Final settlement - particles return to origin
          const returnSpeed = 0.95;
          particle.offsetX *= returnSpeed;
          particle.offsetY *= returnSpeed;
          break;
      }
    } else {
      particle.char = particle.originalChar;
      particle.color = '#54a0ff';
      particle.offsetX *= 0.9;
      particle.offsetY *= 0.9;
    }
  }
}

// Gruvbox Typing Animation Effect
class GruvboxTypingEffect implements EffectStrategy {
  private typingProgress: number = 0;
  
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    if (isHovering) {
      const codeChars = ['(', ')', '{', '}', '[', ']', '<', '>', ';', ':', ',', '.'];
      const keywords = ['if', 'for', 'let', 'var', 'fn', 'def'];
      const operators = ['=', '+', '-', '*', '/', '&', '|', '!', '?'];
      const cursors = ['_', '|', '▌', '▐', '█', '▇'];
      
      // Typewriter wave - sequential appearance
      this.typingProgress = (time * 3) % 100;
      const shouldType = (particle.index * 2) <= this.typingProgress;
      
      if (shouldType) {
        // Recently typed - show cursor effect
        const recentlyTyped = (particle.index * 2) > (this.typingProgress - 5);
        
        if (recentlyTyped && Math.floor(time / 3) % 2 === 0) {
          // Cursor blink at typing position
          particle.char = cursors[Math.floor(time / 2) % cursors.length] || particle.originalChar;
          particle.color = '#ebdbb2'; // Gruvbox cream - bright cursor
        } else {
          // Syntax highlighting based on character type
          const charType = particle.index % 3;
          
          switch (charType) {
            case 0: // Keywords
              particle.char = keywords[particle.index % keywords.length] || particle.originalChar;
              particle.color = '#fe8019'; // Gruvbox orange for keywords
              break;
            case 1: // Operators
              particle.char = operators[particle.index % operators.length] || particle.originalChar;
              particle.color = '#8ec07c'; // Gruvbox green for operators
              break;
            case 2: // Punctuation
              particle.char = codeChars[particle.index % codeChars.length] || particle.originalChar;
              particle.color = '#d3869b'; // Gruvbox purple for punctuation
              break;
          }
        }
        
        // No movement for typed characters (they're "settled")
        particle.offsetX = 0;
        particle.offsetY = 0;
      } else {
        // Not yet typed - invisible
        particle.char = ' ';
        particle.color = 'transparent';
        particle.offsetX = 0;
        particle.offsetY = 0;
      }
    } else {
      particle.char = particle.originalChar;
      particle.color = '#ebdbb2';
      particle.offsetX = 0;
      particle.offsetY = 0;
    }
  }
}

// Gruvbox Visual Selection Effect
class GruvboxVisualSelectionEffect implements EffectStrategy {
  private selectionBounds = { startX: 0, endX: 0, startY: 0, endY: 0 };
  
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering, mousePos } = context;
    
    if (isHovering) {
      const selection = ['█', '▓', '▒', '░', '▌', '▐', '▀', '▄'];
      const boundaries = ['┌', '┐', '└', '┘', '┬', '┴', '├', '┤'];
      const highlights = ['◆', '◇', '◈', '◉', '◎', '●', '○'];
      
      // Dynamic selection area based on mouse position
      const centerX = mousePos.x || particle.baseX;
      const centerY = mousePos.y || particle.baseY;
      
      const selectionRadius = 50 + Math.sin(time * 0.1) * 10;
      const distanceFromCenter = Math.sqrt(
        Math.pow(particle.baseX - centerX, 2) + 
        Math.pow(particle.baseY - centerY, 2)
      );
      
      const isSelected = distanceFromCenter < selectionRadius;
      const isOnBoundary = Math.abs(distanceFromCenter - selectionRadius) < 10;
      
      if (isSelected) {
        // Inside selection
        particle.char = selection[Math.floor(time / 4 + particle.index) % selection.length] || particle.originalChar;
        particle.color = '#fe8019'; // Gruvbox orange for selection
        
        // Selection highlight pulse
        const pulseIntensity = (Math.sin(time * 0.2 + particle.index * 0.1) + 1) * 0.5;
        const brightness = 0.7 + pulseIntensity * 0.3;
        particle.color = `rgba(254, 128, 25, ${brightness})`;
        
        // Gentle selection movement
        particle.offsetX = Math.sin(time * 0.05 + particle.index * 0.2) * 1;
        particle.offsetY = Math.cos(time * 0.04 + particle.index * 0.15) * 0.5;
      } else if (isOnBoundary) {
        // Selection boundary
        particle.char = boundaries[Math.floor(time / 6 + particle.index) % boundaries.length] || particle.originalChar;
        particle.color = '#d65d0e'; // Darker orange for boundary
        
        // Boundary animation
        particle.offsetX = Math.cos(time * 0.15 + particle.index) * 2;
        particle.offsetY = Math.sin(time * 0.12 + particle.index) * 1.5;
      } else {
        // Outside selection - dimmed
        particle.char = particle.originalChar;
        particle.color = '#665c54'; // Gruvbox gray for unselected
        particle.offsetX = 0;
        particle.offsetY = 0;
      }
    } else {
      particle.char = particle.originalChar;
      particle.color = '#fe8019';
      particle.offsetX *= 0.9;
      particle.offsetY *= 0.9;
    }
  }
}

// Gruvbox Syntax Highlight Effect - Light theme with syntax parsing
class GruvboxSyntaxHighlightEffect implements EffectStrategy {
  private parseState = { currentToken: 'normal', parsingPhase: 0 };
  
  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    if (isHovering) {
      // Syntax tokens with appropriate Gruvbox light colors
      const keywords = { chars: ['class', 'def', 'if', 'else', 'for', 'while'], color: '#9d0006' }; // Red
      const strings = { chars: ['"hello"', "'world'", '`template`', 'f"format"'], color: '#79740e' }; // Green
      const numbers = { chars: ['42', '3.14', '0xFF', '1e-6', '0b101'], color: '#af3a03' }; // Orange
      const comments = { chars: ['# comment', '// note', '/* block */'], color: '#928374' }; // Gray
      const operators = { chars: ['=', '+', '-', '*', '/', '&&', '||', '!='], color: '#076678' }; // Blue
      const functions = { chars: ['print()', 'map()', 'filter()', 'reduce()'], color: '#8f3f71' }; // Purple
      
      // Syntax parsing wave - simulates real-time parsing
      this.parseState.parsingPhase = (time * 0.2 + particle.index * 0.1) % (Math.PI * 2);
      const parseIntensity = (Math.sin(this.parseState.parsingPhase) + 1) * 0.5;
      
      // Determine token type based on particle position and parsing phase
      const tokenType = Math.floor((particle.index + parseIntensity * 6)) % 6;
      let tokenData = keywords;
      
      switch (tokenType) {
        case 0: tokenData = keywords; break;
        case 1: tokenData = strings; break;
        case 2: tokenData = numbers; break;
        case 3: tokenData = comments; break;
        case 4: tokenData = operators; break;
        case 5: tokenData = functions; break;
      }
      
      particle.char = tokenData.chars[Math.floor(time / 15 + particle.index) % tokenData.chars.length] || particle.originalChar;
      particle.color = tokenData.color;
      
      // Parsing wave movement - subtle syntax highlighting pulse
      const highlightIntensity = parseIntensity * 0.3;
      particle.offsetX = Math.sin(time * 0.08 + particle.index * 0.25) * highlightIntensity;
      particle.offsetY = Math.cos(time * 0.06 + particle.index * 0.2) * (highlightIntensity * 0.5);
      
      // Error detection - some particles show syntax errors
      const hasError = (particle.index + Math.floor(time / 30)) % 25 === 0;
      if (hasError) {
        particle.char = 'ERROR';
        particle.color = '#cc241d'; // Gruvbox bright red for errors
        
        // Shake animation for errors
        particle.offsetX = Math.sin(time * 0.5 + particle.index) * 2;
        particle.offsetY = Math.cos(time * 0.7 + particle.index) * 1;
      }
      
      // Bracket matching - show connecting lines for brackets
      const isBracket = ['(', ')', '{', '}', '[', ']'].includes(particle.originalChar);
      if (isBracket) {
        particle.color = '#d65d0e'; // Orange for matching brackets
        
        // Bracket highlight pulse
        const bracketPulse = Math.sin(time * 0.3 + particle.index) * 0.5 + 0.5;
        particle.offsetY = bracketPulse * 0.8;
      }
      
    } else {
      particle.char = particle.originalChar;
      particle.color = '#458588'; // Gruvbox light theme blue
      particle.offsetX *= 0.9;
      particle.offsetY *= 0.9;
    }
  }
}

// Simple effects for other cases (keep existing for compatibility)
class SimpleEffect implements EffectStrategy {
  constructor(private config: {
    chars?: string[];
    color: string;
    movement?: (particle: CanvasParticle, time: number) => void;
  }) {}

  apply(particle: CanvasParticle, context: EffectContext): void {
    const { time, isHovering } = context;
    
    if (isHovering && this.config.chars) {
      const charIndex = Math.floor(time / 8 + particle.index) % this.config.chars.length;
      particle.char = this.config.chars[charIndex] || particle.originalChar;
      
      if (this.config.movement) {
        this.config.movement(particle, time);
      }
    } else {
      particle.char = particle.originalChar;
      particle.offsetX *= 0.9;
      particle.offsetY *= 0.9;
    }
    
    particle.color = this.config.color;
  }
}

export class EffectSystem {
  private currentEffect: number = 0;
  private currentMode: VimMode['mode'] = VIM_MODES.NORMAL;
  private mousePos: { x: number; y: number } = { x: 0, y: 0 };
  private effects: Map<number, EffectStrategy> = new Map();

  constructor() {
    this.initializeEffects();
    this.updateColorScheme();
  }

  private initializeEffects(): void {
    // Initialize all effect strategies with custom implementations
    this.effects.set(0, new MatrixRainEffect());              // Matrix Rain
    this.effects.set(1, new BlockchainValidationEffect());    // Blockchain Validation  
    this.effects.set(2, new TradingEffect());                 // Real-time Trading
    this.effects.set(3, new SimpleEffect({                    // AES Encryption (keep existing)
      chars: ['█', '▓', '▒', '░', '◆', '◇', '●', '○'],
      color: '#4ecdc4',
      movement: (particle, time) => {
        particle.offsetX = Math.cos(time * 0.1 + particle.index * 0.3) * 3;
        particle.offsetY = Math.sin(time * 0.08 + particle.index * 0.2) * 2;
      }
    }));
    this.effects.set(4, new SimpleEffect({                    // Distributed Ledger (keep existing)
      chars: ['⟨', '⟩', '⟪', '⟫', '⟬', '⟭', '⟮', '⟯'],
      color: '#45b7d1',
      movement: (particle, time) => {
        const wave = Math.sin(time * 0.03 + particle.index * 0.1);
        particle.offsetX = wave * 4;
        particle.offsetY = Math.cos(time * 0.04 + particle.index * 0.15) * 1.5;
      }
    }));
    
    // NEW UNIQUE EFFECTS
    this.effects.set(5, new SWIFTNetworkEffect());            // SWIFT Network
    this.effects.set(6, new RiskAssessmentEffect());          // Risk Assessment  
    this.effects.set(7, new ComplianceCheckEffect());         // Compliance Check
    this.effects.set(8, new TradeSettlementEffect());         // Trade Settlement
    this.effects.set(9, new GruvboxTypingEffect());           // Gruvbox Typing Animation
    this.effects.set(10, new GruvboxVisualSelectionEffect()); // Gruvbox Visual Selection
    this.effects.set(11, new GruvboxSyntaxHighlightEffect()); // Gruvbox Syntax Highlight
  }

  public setCurrentEffect(effect: number): void {
    this.currentEffect = Math.max(0, Math.min(effect, EFFECT_NAMES.length - 1));
    this.updateColorScheme();
  }

  public setCurrentMode(mode: VimMode['mode']): void {
    this.currentMode = mode;
    this.updateBodyClasses();
  }

  public setMousePosition(x: number, y: number): void {
    this.mousePos.x = x;
    this.mousePos.y = y;
  }

  public getCurrentEffect(): number {
    return this.currentEffect;
  }

  public getCurrentEffectName(): string {
    return EFFECT_NAMES[this.currentEffect] || 'Unknown';
  }

  public getCurrentMode(): VimMode['mode'] {
    return this.currentMode;
  }

  public applyEffectToParticle(particle: CanvasParticle, time: number): void {
    const distance = Math.sqrt(
      Math.pow(this.mousePos.x - particle.baseX, 2) +
        Math.pow(this.mousePos.y - particle.baseY, 2)
    );

    const context: EffectContext = {
      time,
      mousePos: this.mousePos,
      isHovering: distance < 30,
      distance
    };

    const effect = this.effects.get(this.currentEffect);
    if (effect) {
      effect.apply(particle, context);
    } else {
      // Fallback default effect
      particle.color = '#ffffff';
    }
  }

  private updateColorScheme(): void {
    // Remove all existing scheme classes
    Object.values(COLOR_SCHEMES).forEach((scheme) => {
      document.body.classList.remove(scheme);
    });

    // Apply the current scheme
    const currentScheme = Object.values(COLOR_SCHEMES)[this.currentEffect];
    if (currentScheme) {
      document.body.classList.add(currentScheme);
      
      // Persist scheme selection
      try {
        localStorage.setItem('schemeIndex', String(this.currentEffect));
      } catch {
        // localStorage not available
      }
    }
  }

  private updateBodyClasses(): void {
    // Remove existing vim mode classes
    document.body.className = document.body.className.replace(
      /\bvim-\w+\b/g,
      ''
    );
    document.body.classList.add(`vim-${this.currentMode.toLowerCase()}`);
  }

  public updateVimModeDisplay(): void {
    const modeElement = document.getElementById('statusMode');
    const schemeElement = document.getElementById('colorSchemeDisplay');
    
    if (modeElement) {
      modeElement.textContent = this.currentMode;
      modeElement.className = `status-mode ${this.currentMode.toLowerCase()}`;
    }
    
    if (schemeElement) {
      schemeElement.textContent = `Scheme: ${this.getCurrentEffectName()}`;
    }
  }

  public destroy(): void {
    this.effects.clear();
  }
}