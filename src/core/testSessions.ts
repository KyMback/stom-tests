class TestSessionsManager {
  private subscribers: (() => void)[] = [];

  private listKey = () => "testSession/all";
  private itemKey = (id: string) => `testSession/${id}`;

  private cache: {
    list: TestSessionListItem[] | null;
  } = {
    list: null,
  };

  public list = (): TestSessionListItem[] => {
    if (this.cache.list) {
      return this.cache.list;
    }

    const items = localStorage.getItem(this.listKey());

    if (!items) {
      return [];
    }

    return (this.cache.list = JSON.parse(items));
  };

  private saveList = (items: TestSessionListItem[]) => {
    localStorage.setItem(this.listKey(), JSON.stringify(items));
    this.cache.list = items;
    this.onChange();
  };

  public get = (id: string): TestSession | null => {
    const session = localStorage.getItem(this.itemKey(id));

    if (!session) {
      return null;
    }

    return JSON.parse(session);
  };

  public delete = (id: string) => {
    localStorage.removeItem(this.itemKey(id));
    const list = this.list();
    this.saveList(list.filter((e) => e.id !== id));
    this.onChange();
  };

  public save = (session: TestSession) => {
    localStorage.setItem(this.itemKey(session.id), JSON.stringify(session));
    const list = this.list();

    if (!list.some((e) => e.id === session.id)) {
      this.saveList([
        ...list,
        {
          id: session.id,
          createdAt: session.createdAt,
          test: session.test,
        },
      ]);
    }

    this.onChange();
    return session;
  };

  public subscribe = (callback: () => void) => {
    this.subscribers.push(callback);

    return () => {
      this.subscribers = this.subscribers.filter((e) => e !== callback);
    };
  };

  private onChange = () => {
    this.subscribers.forEach((e) => e());
  };
}

export const testSessionsStore = new TestSessionsManager();

export interface TestSessionListItem {
  id: string;
  createdAt: string;
  test: {
    id: string;
    name: string;
  };
}

export interface TestSession {
  id: string;
  createdAt: string;
  test: {
    id: string;
    name: string;
  };
  answers: Record<
    number,
    {
      answered: boolean;
      answers: number[];
    }
  >;
}
