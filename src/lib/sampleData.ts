import { type Person } from '@/components/VortexAvatars';

// Generate sample people with realistic names
const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Blake', 'Cameron', 'Dakota', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kendall',
  'Lane', 'Sage', 'River', 'Phoenix', 'Rowan', 'Skyler', 'Tatum', 'Drew',
  'Reese', 'Parker', 'Peyton', 'Reagan', 'Remy', 'Shiloh'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

export function generateSamplePeople(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
      id: `sample_${i + 1}`,
      name: `${firstName} ${lastName}`,
      image: undefined
    };
  });
}

// Pre-generated sets for common use cases
export const samplePeople30 = generateSamplePeople(30);
export const samplePeople40 = generateSamplePeople(40);
export const samplePeople100 = generateSamplePeople(100);
