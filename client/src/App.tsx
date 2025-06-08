import { useState } from 'react';
import { useWebsocket } from './hooks/useWebsocket';
import { REGIONS } from './constants';
import type { Region, RegionResponse } from './types';
import './styles/App.css'

function App() {
  const { status, error: wsError, lastUpdated, isReconnecting } = useWebsocket();
  const [expanded, setExpanded] = useState<Record<Region, boolean>>(() => {
    const initial: Record<Region, boolean> = {
      "us-east": true,
      "eu-west": true,
      "eu-central": true,
      "us-west": true,
      "sa-east": true,
      "ap-southeast": true
    }
    return initial;
  })

  function toggleCard(region: Region) {
    setExpanded(prev => ({
      ...prev,
      [region]: !prev[region]
    }))
  }

  function isRegionResponse(data: unknown): data is RegionResponse {
    if (typeof data !== "object" || data == null) return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.status === "string" &&
      typeof obj.region === "string" &&
      typeof obj.version === "string" &&
      typeof obj.results === "object" &&
      obj.results !== null &&
      Array.isArray(obj.roles)
    );
  }

  return (
    <section>
      <h1>Region Status Dashboard</h1>
      {/* Last Updated Timestamp */}
      {lastUpdated && (
        <div className="lastUpdated">
          Last Updated: {lastUpdated.toLocaleString()}
        </div>
      )}
      {wsError && <div className="wsError">{wsError}</div>}
      {isReconnecting && (
        <div className="reconnect">Reconnecting to server...</div>
      )}

      <div className="dashboard">
        {REGIONS.map(region => {
          const isOpen = expanded[region]
          const regionStatus = status?.[region];
          return (
            <div className="card" key={region}>
              <header>
                <div className="metadata">
                  <h2 className="regionName">
                    {region}
                  </h2>
                  <div>
                    {regionStatus?.status === "ok" && <span className="ok">OK</span> }
                    {regionStatus?.status === "error" && <span className="ok">Error</span> }
                    {regionStatus?.status === "timeout" && <span className="ok">Timeout</span> }
                    {regionStatus?.status === "unknown" && <span className="ok">Unknown</span> }
                  </div>
                  <div className="errorMetadata">
                    {regionStatus?.error}
                  </div>
                </div>
                <button
                  className="headerButton"
                  onClick={() => toggleCard(region)}
                  aria-label={isOpen ? `Collapse ${region}` : `Expand ${region}`}
                  title={isOpen ? "Collapse" : "Expand"}
                >
                  {isOpen ? "▾" : "▸"}
                </button>
              </header>
              {isOpen && (
                <main>
                  {regionStatus?.status === "ok" && regionStatus.data ? (
                    isRegionResponse(regionStatus.data) ? (
                      <section className='regionData'>
                        <div className="regionDetes">
                          <div className="regionDetail">
                            <div><b>Region:</b> { regionStatus.data.region }</div>
                            <div><b>Status:</b> {regionStatus.data.status}</div>
                            <div><b>Version:</b> {regionStatus.data.version}</div>
                            <div><b>Roles:</b> {regionStatus.data.roles}</div>
                            <div><b>Strict:</b> {String(regionStatus.data.strict)}</div>
                            <div><b>Server Issue:</b> {regionStatus.data.server_issue ?? "None"}</div>
                            <div className='regionServices'>
                              <b>Services</b>
                              <ul>
                                <li>Database: { regionStatus.data.results.services.database ? "✅" : "❌" }</li>
                                <li>Redis: { regionStatus.data.results.services.redis ? "✅" : "❌" }</li>
                              </ul>
                            </div>
                          </div>
                          <div className="regionStats">
                            <div>
                              <b>Stats:</b>
                              <ul>
                                <li>Servers Count: { regionStatus.data.results.stats.servers_count }</li>
                                <li>Online: { regionStatus.data.results.stats.online }</li>
                                <li>Session: { regionStatus.data.results.stats.session }</li>
                                <li>CPU Load: { regionStatus.data.results.stats.server.cpu_load }</li>
                                <li>Active Connections: { regionStatus.data.results.stats.server.active_connections }</li>
                                <li>Wait Time: { regionStatus.data.results.stats.server.wait_time }</li>
                                <li>Timers: { regionStatus.data.results.stats.server.timers }</li>
                                <li>CPUs: { regionStatus.data.results.stats.server.cpus }</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="workersTable">
                          <b>Workers:</b>
                        </div>
                      </section>
                    ): (
                      <section className='invalidData'>Invalid data structure</section>
                  )
                  ): (
                    <section className='noData'>No data available</section>
                  )}
                </main>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default App
