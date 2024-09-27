// RoundRobinBracket.tsx
import React from 'react';

interface RoundRobinBracketProps {
  teams: string[];
  matches: Record<string, Record<string, string | null>>;
}

const RoundRobinBracket: React.FC<RoundRobinBracketProps> = ({ teams, matches }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Teams</th>
            {teams.map((team, index) => (
              <th key={index} className="border px-4 py-2">{team}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((team, rowIndex) => (
            <tr key={rowIndex} className="border">
              <td className="border px-4 py-2 font-bold">{team}</td>
              {teams.map((opponent, colIndex) => (
                <td key={colIndex} className="border px-4 py-2">
                  {rowIndex !== colIndex && matches[team][opponent] ? matches[team][opponent] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoundRobinBracket;
