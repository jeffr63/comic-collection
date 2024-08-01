import { Issue, IssueData } from '../app/shared/models/issue';
import { Publisher } from '../app/shared/models/publisher';
import { Title } from '../app/shared/models/title';
import { User } from '../app/shared/models/user';

export const fakeIssueData: Issue[] = [
  {
    id: 1,
    publisher: 'p1',
    title: 't1',
    issue: 1,
    coverPrice: 1,
    url: '',
  },
  {
    id: 2,
    publisher: 'p1',
    title: 't1',
    issue: 2,
    coverPrice: 1,
    url: '',
  },
  {
    id: 3,
    publisher: 'p2',
    title: 't2',
    issue: 1,
    coverPrice: 2,
    url: '',
  },
];

export const fakeIssuePublishersData: IssueData[] = [
  { name: 'p1', value: 2 },
  { name: 'p2', value: 1 },
];

export const fakeIssueTitlesData: IssueData[] = [
  { name: 't1', value: 2 },
  { name: 't2', value: 1 },
];

export const fakeIssue: Issue = {
  publisher: 'p4',
  title: 't4',
  issue: 1,
  coverPrice: 1,
  url: '',
  id: 4,
};

export const fakeTitleData: Title[] = [
  {
    publisher: 'p1',
    title: 't1',
    id: 1,
  },
  {
    publisher: 'p2',
    title: 't2',
    id: 2,
  },
];

export const fakeTitle: Title = {
  publisher: 'p3',
  title: 't3',
  id: 3,
};

export const fakePublisherData: Publisher[] = [
  {
    name: 'p1',
    id: 1,
  },
  {
    name: 'p2',
    id: 2,
  },
];

export const fakePublisher: Publisher = {
  name: 'p3',
  id: 3,
};

export const fakeUserData: User[] = [
  {
    email: 'abc.com',
    password: '123',
    name: 'abc',
    role: 'admin',
    id: 1,
  },
  {
    email: 'def.com',
    password: '456',
    name: 'def',
    role: 'editor',
    id: 2,
  },
];

export const fakeUser: User = {
  email: 'ghi.com',
  password: '789',
  name: 'ghi',
  role: 'editor',
  id: 3,
};
