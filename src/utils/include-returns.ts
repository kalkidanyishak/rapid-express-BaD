import { PrismaClient } from "@prisma/client";

const includeReturns = (schemaName: keyof PrismaClient) => {
  const objectify = (arr: string[]) => Object.fromEntries(arr.map(key => [key, true])) as Record<string, true>;

const relations: Partial<Record<keyof PrismaClient, string[]>> = {
  user: ['enrollments', 'completions', 'proposals', 'votes', 'comments', 'organizerEvents', 'attendeeTickets', 'holders', 'progresses', 'awards'],
  coreTeamMember: [],
  lesson: ['badge', 'enrollments', 'completions'],
  enrollment: ['user', 'lesson'],
  badge: ['lessons', 'awards'],
  userAward: ['user', 'badge'],
  proposal: ['user', 'votes', 'comments'],
  vote: ['proposal', 'user'],
  comment: ['proposal', 'user'],
  event: ['organizer', 'tickets'],
  ticket: ['event', 'user'],
  nFT: ['holders', 'progresses'],
  holder: ['user', 'nFT'],
  progress: ['user', 'nFT'],
  completion: ['user', 'lesson'],
};

  return objectify(relations[schemaName] || []);
};

export default includeReturns;
