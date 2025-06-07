import { useWebsocket } from './hooks/useWebsocket';
import './styles/App.css'
import { REGIONS } from './constants';

function App() {
 const { status, error: wsError, lastUpdated, isReconnecting } = useWebsocket();

  return (
    <div className="app">
      <h1>Region Status Dashboard</h1>
      {/* Last Updated Timestamp */}
      {lastUpdated && (
        <div className="lastUpdated">
          Last Updated: {lastUpdated.toLocaleString()}
        </div>
      )}
      {wsError && <div className="error">{wsError}</div>}
      {isReconnecting && (
        <div className="reconnect">Reconnecting to server...</div>
      )}

      <div className="card">
        {REGIONS.map(region => {
          return (
            <div className="region" key={region.split('-').join('')}>
              {region}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App
