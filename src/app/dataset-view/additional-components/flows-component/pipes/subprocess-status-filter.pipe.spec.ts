import { SubprocessStatusFilterPipe } from './subprocess-status-filter.pipe';

describe('SubprocessStatusFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new SubprocessStatusFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
