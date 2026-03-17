export interface CravingItem {
  id: string;
  label: string;
  emoji: string;
}

export interface NeedResult {
  need: string;
  suggestions: [string, string]; // exactly 2 suggestions
}

export const CRAVINGS: CravingItem[] = [
  { id: 'sugar', label: 'Sugar / sweets', emoji: '🍬' },
  { id: 'caffeine', label: 'Caffeine / coffee', emoji: '☕' },
  { id: 'scrolling', label: 'Social media', emoji: '📱' },
  { id: 'snacks', label: 'Junk food', emoji: '🍟' },
  { id: 'shopping', label: 'Impulse purchase', emoji: '🛒' },
  { id: 'gaming', label: 'Video games', emoji: '🎮' },
  { id: 'alcohol', label: 'Alcohol', emoji: '🍺' },
  { id: 'nicotine', label: 'Nicotine', emoji: '🚬' },
  { id: 'procrastinating', label: 'Procrastinating', emoji: '😮‍💨' },
  { id: 'restless', label: 'Restlessness', emoji: '🦶' },
  { id: 'binging', label: 'Binge-watching', emoji: '📺' },
  { id: 'impulse-chat', label: 'Impulsive texting', emoji: '💬' },
  { id: 'thc', label: 'Weed / THC', emoji: '🌿' },
];

export const MAPPINGS: Record<string, NeedResult> = {
  sugar: { need: 'Energy regulation', suggestions: ['Eat a protein snack', 'Drink a full glass of water'] },
  caffeine: { need: 'Mental activation', suggestions: ['Take a 5-min movement break', 'Splash cold water on your face'] },
  scrolling: { need: 'Stimulation or escape', suggestions: ['Put your phone in another room for 10 min', 'Text one specific person intentionally'] },
  snacks: { need: 'Sensory stimulation', suggestions: ['Eat something crunchy and healthy', 'Chew gum'] },
  shopping: { need: 'Novelty or accomplishment', suggestions: ['Add to a wishlist and wait 24h', 'Complete one small task first'] },
  gaming: { need: 'Mastery or escape', suggestions: ['Break a real task into steps like levels', 'Watch a 5-min skill tutorial'] },
  alcohol: { need: 'Relaxation or connection', suggestions: ['Call someone you like', 'Take a warm shower'] },
  nicotine: { need: 'Pause and reset', suggestions: ['Step outside without a cigarette', 'Take 5 slow deep breaths'] },
  procrastinating: { need: 'Clarity on what to do', suggestions: ['Write the single next physical step', 'Set a 2-min timer and just start'] },
  restless: { need: 'Movement or sensory input', suggestions: ['Go for a 5-min walk', 'Do 10 jumping jacks'] },
  binging: { need: 'Rest or emotional escape', suggestions: ['Take a real 20-min nap', "Write down what you're avoiding"] },
  'impulse-chat': { need: 'Connection or validation', suggestions: ['Write what you want to say and wait 10 min', 'Call one person intentionally'] },
  thc: { need: 'Anxiety relief or boredom', suggestions: ['Try 4-7-8 breathing for 2 minutes', 'Go outside and change your environment'] },
};
