global.localStorage = {
  getItem: jest.fn().mockReturnValue("{}"),
  setItem: jest.fn()
};
global.window = { 
  dispatchEvent: jest.fn(),
  location: { origin: "http://localhost", pathname: "/" }
};
global.CustomEvent = jest.fn();
global.document = {
  getElementById: jest.fn().mockReturnValue({ value: "votes" }),
  querySelectorAll: jest.fn().mockReturnValue([]),
  documentElement: {
    setAttribute: jest.fn(),
    getAttribute: jest.fn().mockReturnValue("dark")
  }
};
