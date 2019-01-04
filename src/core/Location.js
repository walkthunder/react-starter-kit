import createHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';

const location = useQueries(process.env.BROWSER ? createHistory : createMemoryHistory)();
if (!global.process) {
  window.Location = location;
}
export default location;
