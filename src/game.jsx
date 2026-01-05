import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import './game.css';

const Game = () => {
  // Text with LaTeX patterns - similar to your Dart function
  const equations = [
    {
      id: 1,
      text: "Volume = \\( \\frac{1}{3} \\times \\text{base area} \\times \\text{height} = \\frac{1}{3} \\times 10^2 \\times 18 = 600 \\) m³.",
      description: "Volume of a pyramid"
    },
    {
      id: 2,
      text: "\\( 15\\pi r^2 - \\frac{1}{3}\\pi r^3 \\)",
      description: "Mathematical expression"
    }
  ];

  // Function to extract and render LaTeX from text - similar to Dart's _buildTextWithLatex
  const renderTextWithLatex = (text, fontSize = 16, textStyle = {}) => {
    // Similar to your Dart RegExp pattern
    const latexPattern = /\\\[.*?\\\]|\\\(.*?\\\)|\\(?:frac|sqrt|sum|int|lim|sin|cos|tan|log|ln)\b/g;
    
    // Find all LaTeX expressions
    const latexMatches = [];
    let match;
    const regex = new RegExp(latexPattern);
    let lastIndex = 0;
    
    while ((match = regex.exec(text)) !== null) {
      latexMatches.push({
        text: match[0],
        index: match.index
      });
    }

    // If no LaTeX found, return plain text
    if (latexMatches.length === 0) {
      return <span style={{ fontSize: `${fontSize}px`, ...textStyle }}>{text}</span>;
    }

    // Split text and render LaTeX parts
    const parts = [];
    let currentIndex = 0;

    latexMatches.forEach((match, i) => {
      // Add plain text before LaTeX
      if (match.index > currentIndex) {
        parts.push(
          <span key={`plain-${i}`} style={{ fontSize: `${fontSize}px`, ...textStyle }}>
            {text.substring(currentIndex, match.index)}
          </span>
        );
      }

      // Add LaTeX
      const latexContent = match.text
        .replace(/^\\\(/, '')  // Remove starting \(
        .replace(/\\\)$/, '')  // Remove ending \)
        .replace(/^\\\[/, '')  // Remove starting \[
        .replace(/\\\]$/, ''); // Remove ending \]

      parts.push(
        <span key={`latex-${i}`} className="latex-container" style={textStyle}>
          <InlineMath math={latexContent} />
        </span>
      );

      currentIndex = match.index + match.text.length;
    });

    // Add any remaining plain text
    if (currentIndex < text.length) {
      parts.push(
        <span key="plain-last" style={{ fontSize: `${fontSize}px`, ...textStyle }}>
          {text.substring(currentIndex)}
        </span>
      );
    }

    return <span className="text-with-latex">{parts}</span>;
  };

  // Simple rendering without complex parsing
  const SimpleLatexDisplay = () => {
    return (
      <div className="equations-container">
        <h2>Mathematical Equations</h2>
        
        <div className="equation-card">
          <h3>Equation 1: Volume of a Pyramid</h3>
          <div className="equation-content">
            <p className="equation-text">
              Volume = <InlineMath math="\frac{1}{3} \times \text{base area} \times \text{height} = \frac{1}{3} \times 10^2 \times 18 = 600" /> m³
            </p>
            <div className="equation-render">
              <BlockMath math="\text{Volume} = \frac{1}{3} \times \text{base area} \times \text{height}" />
              <BlockMath math="= \frac{1}{3} \times 10^2 \times 18 = 600 \text{ m}^3" />
            </div>
          </div>
        </div>

        <div className="equation-card">
          <h3>Equation 2: Expression</h3>
          <div className="equation-content">
            <p className="equation-text">
              Expression: <InlineMath math="15\pi r^2 - \frac{1}{3}\pi r^3" />
            </p>
            <div className="equation-render">
              <BlockMath math="15\pi r^2 - \frac{1}{3}\pi r^3" />
            </div>
          </div>
        </div>

        <div className="equation-card">
          <h3>Using the Text Parser (similar to Dart function)</h3>
          <div className="parsed-equations">
            {equations.map(eq => (
              <div key={eq.id} className="parsed-equation">
                <p className="equation-description">{eq.description}:</p>
                <div className="parsed-result">
                  {renderTextWithLatex(eq.text, 18, { color: '#2c3e50' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="equation-card">
          <h3>More Examples</h3>
          <div className="examples">
            <p><InlineMath math="\sqrt{x^2 + y^2}" /></p>
            <p><InlineMath math="\sum_{i=1}^{n} i = \frac{n(n+1)}{2}" /></p>
            <p><InlineMath math="\int_{a}^{b} f(x) dx" /></p>
            <p><InlineMath math="\lim_{x \to 0} \frac{\sin x}{x} = 1" /></p>
            <p><InlineMath math="\cos^2 \theta + \sin^2 \theta = 1" /></p>
            <p><InlineMath math="\log_b(xy) = \log_b x + \log_b y" /></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Mathematics Game</h1>
        <p>LaTeX Equations Renderer</p>
      </header>
      
      <main className="game-main">
        <SimpleLatexDisplay />
      </main>
      
      <footer className="game-footer">
        <p>Built with React and KaTeX</p>
        <p>Similar to Dart's LaTeX rendering function</p>
      </footer>
    </div>
  );
};

export default Game;