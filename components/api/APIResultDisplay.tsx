import React from 'react';

export default function APIResultDisplay({ apiId, data }: { apiId: number, data: any }) {
  if (!data) return null;
  
  if (data.error || (data.cod && String(data.cod) !== "200")) {
    const errorMsg = data.error || data.message || `API Error (Code: ${data.cod})`;
    return <div className="text-red-500 font-bold p-4 bg-red-500/10 rounded-xl border border-red-500/20">{errorMsg}</div>;
  }

  // Weather
  if (apiId === 0) {
    const tempCelsius = data.main?.temp !== undefined ? (Number(data.main.temp) - 273.15).toFixed(1) : '--';
    const desc = data.weather?.[0]?.description || 'Unknown';
    const main = data.weather?.[0]?.main || 'Clear';
    
    // Animate based on weather main
    const getIcon = () => {
      if (main.includes('Cloud')) return '☁️';
      if (main.includes('Rain') || main.includes('Drizzle')) return '🌧️';
      if (main.includes('Thunderstorm')) return '⛈️';
      if (main.includes('Snow')) return '❄️';
      if (main.includes('Clear')) return '☀️';
      if (main.includes('Haze') || main.includes('Mist') || main.includes('Fog')) return '🌫️';
      return '🌡️';
    };

    const getGradient = () => {
      if (main.includes('Clear')) return 'from-cyan-400 via-blue-500 to-blue-600';
      if (main.includes('Cloud')) return 'from-blue-400 via-indigo-500 to-gray-600';
      if (main.includes('Haze') || main.includes('Mist') || main.includes('Fog')) return 'from-fuchsia-500 via-purple-500 to-indigo-600';
      if (main.includes('Rain') || main.includes('Drizzle')) return 'from-blue-600 via-indigo-700 to-blue-900';
      if (main.includes('Thunderstorm')) return 'from-purple-800 via-gray-900 to-black';
      return 'from-[#F5C518] to-[#00E676]';
    };

    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-gradient-to-br ${getGradient()} rounded-2xl border border-white/20 relative overflow-hidden shadow-2xl`}>
        {/* Dark subtle overlay to guarantee text readability */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent animate-pulse"></div>
        
        <h2 className="text-3xl font-black text-white mb-2 z-10 tracking-tight drop-shadow-lg">{data.name}, {data.sys?.country}</h2>
        
        <div className="relative z-10 my-6 flex items-center justify-center">
           {/* Colorful glowing aura behind the icon */}
           <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 blur-3xl opacity-70 animate-pulse rounded-full w-32 h-32 scale-150"></div>
           <div className="text-8xl animate-[bounce_3s_infinite] drop-shadow-[0_0_30px_rgba(255,255,255,1)] relative z-10">
             {getIcon()}
           </div>
        </div>
        
        <div className="text-6xl font-black text-white z-10 tracking-tighter drop-shadow-xl">{tempCelsius}°C</div>
        <p className="text-white capitalize text-2xl mt-2 z-10 font-bold drop-shadow-md tracking-wide">{desc}</p>
        
        <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-md z-10">
          <div className="bg-black/50 p-4 rounded-xl text-center border border-white/20 backdrop-blur-md shadow-inner">
            <div className="text-gray-300 text-[10px] font-bold uppercase tracking-widest mb-1">Humidity</div>
            <div className="text-white font-bold text-lg drop-shadow-sm">{data.main?.humidity}%</div>
          </div>
          <div className="bg-black/50 p-4 rounded-xl text-center border border-white/20 backdrop-blur-md shadow-inner">
            <div className="text-gray-300 text-[10px] font-bold uppercase tracking-widest mb-1">Wind</div>
            <div className="text-white font-bold text-lg drop-shadow-sm">{data.wind?.speed} m/s</div>
          </div>
          <div className="bg-black/50 p-4 rounded-xl text-center border border-white/20 backdrop-blur-md shadow-inner">
            <div className="text-gray-300 text-[10px] font-bold uppercase tracking-widest mb-1">Pressure</div>
            <div className="text-white font-bold text-lg drop-shadow-sm">{data.main?.pressure} hPa</div>
          </div>
        </div>
      </div>
    );
  }

  // News
  if (apiId === 1) {
    const articles = data.articles?.slice(0, 3) || [];
    return (
      <div className="space-y-4">
        {articles.length === 0 ? <p className="text-white">No articles found. Debug: {JSON.stringify(data)}</p> : null}
        {articles.map((art: any, i: number) => (
          <div key={i} className="p-5 bg-[#0B0E14] rounded-xl border border-[#1E293B] hover:border-[#F5C518]/50 transition-all flex flex-col group shadow-lg">
            <div className="text-[10px] text-[#F5C518] font-black mb-2 uppercase tracking-widest">{art.source?.name || 'News Source'}</div>
            <a href={art.url || '#'} target="_blank" rel="noreferrer" className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">{art.title}</a>
            {art.description && <p className="text-gray-400 text-sm mt-3 line-clamp-2 leading-relaxed">{art.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Crypto
  if (apiId === 2) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(data).map(([coin, info]: any) => (
          <div key={coin} className="p-6 bg-gradient-to-b from-[#0F172A] to-[#020617] rounded-xl border border-[#00E676]/30 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#00E676] opacity-10 rounded-full -mr-8 -mt-8 blur-xl"></div>
            <div className="text-gray-400 uppercase tracking-widest text-[10px] font-black mb-3 z-10">{coin}</div>
            <div className="text-3xl font-black text-[#00E676] z-10 tracking-tight">${info.usd?.toLocaleString()}</div>
          </div>
        ))}
      </div>
    );
  }

  // Summary & Translate
  if (apiId === 3 || apiId === 4) {
    const textResult = data.summary || data.translation || "No result returned.";
    return (
      <div className="p-8 bg-gradient-to-br from-[#0B0E14] to-[#050505] rounded-xl border border-[#1E293B] relative shadow-2xl">
        <div className="absolute -left-1 top-6 bottom-6 w-1.5 bg-gradient-to-b from-[#FDE047] to-[#F5C518] rounded-r-full shadow-[0_0_10px_rgba(245,197,24,0.5)]"></div>
        <p className="text-lg text-white leading-loose font-medium pl-4 whitespace-pre-wrap">{textResult}</p>
      </div>
    );
  }

  // Fallback for unknown data
  return <pre className="bg-[#050505] p-4 rounded-xl text-[#00E676] overflow-x-auto border border-[#1E293B] text-sm">{JSON.stringify(data, null, 2)}</pre>;
}
