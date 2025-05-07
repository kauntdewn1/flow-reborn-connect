declare module '*.png' {
  const value: string;
  export default value;
}

declare module './components/VisualEffect' {
  const VisualEffect: React.FC<{ level: number }>;
  export default VisualEffect;
} 