import { Device } from './device';

describe('Device', () => {
  it('should create an instance', () => {
    expect(new Device("",0,false)).toBeTruthy();
  });
});
