const fs = require('fs');

let f = 'src/App.tsx';
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('import React, {', 'import {'));

f = 'src/components/kanban/KanbanColumn.tsx';
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('onDragEnd={(e) => {}}', 'onDragEnd={() => {}}'));

f = 'src/components/kanban/TicketCard.tsx';
let txt = fs.readFileSync(f, 'utf8');
txt = txt.replace('DropletOff', 'Ban').replace('DropletOff', 'Ban');
txt = txt.replace(/import \{ useTickets, useToast \}.*;\r?\n/g, '');
fs.writeFileSync(f, txt);

f = 'src/components/layout/Navbar.tsx';
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('Mic, ', ''));

f = 'src/components/list/ListView.tsx';
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('Priority, Status, ', ''));

f = 'src/components/overlays/EscalationModal.tsx';
txt = fs.readFileSync(f, 'utf8');
txt = txt.replace(/CornerSystemUpRight/g, 'CornerUpRight');
fs.writeFileSync(f, txt);

f = 'src/components/overlays/TicketDetailPanel.tsx';
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('const { remaining, isBreached, display, colorClass } = useSLA(ticket);', 'const { display, colorClass } = useSLA(ticket);'));

f = 'src/hooks/useTickets.ts';
txt = fs.readFileSync(f, 'utf8');
txt = txt.replace(', useMemo', '');
txt = txt.replace('urgency: string', '_urgency: string');
fs.writeFileSync(f, txt);

console.log('Fixed TS errors');
