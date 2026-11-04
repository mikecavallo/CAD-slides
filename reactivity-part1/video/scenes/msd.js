// Management: Solutions and Setups, Part 5 (dog and cat conflict) and Part 6 (going for rides).
//   ms05s00     dog and cat conflict: the deck's summary line and the four setups
//   ms05s01-04  one setup each on Tori's pictures
//   ms06s00     going for rides: summary and the five setups
//   ms06s01-05  one setup each
(() => {
  registerScene('ms05s00', ctx => MS.overview(ctx, { title: 'Dog & cat conflict',
    lead: 'Keep the cat safe by *separating the species* and giving the cat its own dog-free space, so the chase never gets a chance to start.',
    items: ['Give the cat dog-free zones', 'Put cat resources out of reach', 'Leash & supervise together time', 'Separate when you’re away'] }));

  const CAT = [
    { title: 'Give the cat dog-free zones', src: 'ms_s38.jpg', nat: [1050, 1400],
      lead: 'A room *only the cat can reach*, and a way *up and away*:',
      chips: [['A baby gate', 'green', 'fence', false, 'baby gates'], ['A cracked door', 'green', 'door-open', false, 'cracked door'], ['Cat trees and shelves', 'green', 'cat', false, 'cat trees']],
      why: 'A cat with a safe exit never has to run, and a dog that can’t follow *never gets to chase*.',
      mark: { rings: [[0.48, 0.19, 60], [0.68, 0.74, 60]], tag: ['Up and away', 0.96, 0.05], phrase: 'cat trees' } },
    { title: 'Put cat resources out of reach', src: 'ms_s39.jpg', nat: [1050, 1400],
      lead: 'Somewhere the dog *can’t get to*, like up high or behind a cat-only door:',
      chips: [['Litter box', 'green', 'box', false, 'litter box'], ['Food', 'green', 'utensils', false, 'food'], ['Water', 'green', 'droplet', false, 'water']],
      why: 'Nothing to guard or chase over, and the dog *stays away from problem areas*.',
      mark: { rings: [[0.5, 0.13, 110]], tag: ['Behind the gate', 0.04, 0.95], phrase: 'cat-only door' } },
    { title: 'Leash & supervise together time', src: 'ms_s40.jpg', nat: [1050, 1400],
      lead: 'During any shared time: *leash or drag line on*, and reward calm.',
      chips: [['Never loose together until it’s safe', 'amber', 'shield-alert', false, 'never let the two']],
      why: 'A leash lets you *stop a chase before it starts*, so the dog never gets to practice it.',
      mark: { rings: [[0.2, 0.62, 50], [0.75, 0.47, 50]], tag: ['Leash on', 0.96, 0.95], phrase: 'leash or drag line' } },
    { title: 'Separate when you’re away', src: 'ms_s41.jpg', nat: [1400, 1050],
      lead: 'No one home to supervise?',
      chips: [['Crate the dog', 'green', 'lock', false, 'crate the dog'], ['The dog in its own room', 'green', 'door-closed', false, 'own room'], ['The cat moves freely', 'green', 'cat', false, 'move around freely']],
      why: 'Full separation removes any chance of *an incident you can’t interrupt*.',
      mark: { rings: [[0.68, 0.62, 80]], tag: ['Together only when you’re home', 0.04, 0.05], phrase: 'no one’s home' } },
  ];
  CAT.forEach((o, i) => registerScene(`ms05s${String(i + 1).padStart(2, '0')}`, ctx => MS.tip(ctx, { sec: 'Dog & cat conflict', icon: 'cat', n: i + 1, ...o })));

  registerScene('ms06s00', ctx => MS.overview(ctx, { title: 'Going for rides',
    lead: '*Cover the windows, secure your dog, and choose calm routes*, so the car stops being a trigger on wheels.',
    items: ['Block the view', 'Secure your dog properly', 'Choose calm routes', 'Avoid trips & park smart', 'Keep trips short'] }));

  const RIDE = [
    { title: 'Block the view', src: 'ms_s43.jpg', nat: [933, 1400],
      lead: 'So your dog *simply can’t see out the windows*:',
      chips: [['Window shades', 'green', 'blinds', false, 'window shades'], ['A crate cover', 'green', 'panel-top', false, 'crate cover'], ['Crate placement', 'green', 'car', false, 'position the crate']],
      why: 'Removing the visual trigger is *the single most effective change* in the car.',
      mark: { rings: [[0.5, 0.52, 110, 'var(--amber)']], tag: ['Block this view', 0.04, 0.05, 'amber'], phrase: 'see out' } },
    { title: 'Secure your dog properly', src: 'ms_s44.jpg', nat: [1050, 1400],
      lead: 'So they *can’t move freely* around the car:',
      chips: [['A crash-tested crate', 'green', 'shield-check', false, 'crash-tested'], ['A harness', 'green', 'link', false, 'harness'], ['A barrier', 'green', 'fence', false, 'barrier']],
      why: 'A settled, contained dog *can’t pace, lunge, or pinball* between windows.',
      mark: { rings: [[0.27, 0.45, 110]], tag: ['Contained', 0.96, 0.05], phrase: 'crash-tested' } },
    { title: 'Choose calm routes', src: 'ms_s45.jpg', nat: [1050, 1400],
      lead: 'A route that keeps moving: *fewer lights and stop signs*.',
      chips: [['Back roads', 'green', 'route', false, 'back roads'], ['Right turns', 'green', 'corner-up-right', false, 'right turns'], ['Less idling', 'green', 'timer', false, 'less idling']],
      why: 'A car that keeps rolling gives your dog *far less to lock onto*.',
      mark: { tag: ['Keep rolling', 0.04, 0.05], phrase: 'keeps moving' } },
    { title: 'Avoid trips & park smart', src: 'ms_s46.jpg', nat: [1400, 933],
      lead: 'Ride *only when it’s truly needed*. Park away from:',
      chips: [['Traffic', 'amber', 'car-front', false, 'traffic'], ['Busy entrances', 'amber', 'store', false, 'busy entrances'], ['Cars with dogs in them', 'amber', 'dog', false, 'other cars']],
      why: 'Fewer, calmer trips mean *fewer chances to practice* the reaction.',
      mark: { rings: [[0.9, 0.6, 50]], tag: ['Park far out', 0.96, 0.05], phrase: 'park away' } },
    { title: 'Keep trips short', src: 'ms_s47.jpg', nat: [933, 1400],
      chips: [['Brief rides, quiet places', 'green', 'timer', false, 'very brief'], ['Long drives through busy areas', 'red', 'route', true, 'long drives']],
      why: 'Short, easy trips keep your dog *under threshold*, where calm is possible.',
      mark: { rings: [[0.42, 0.55, 110]], tag: ['Short and easy', 0.04, 0.05], phrase: 'very brief' } },
  ];
  RIDE.forEach((o, i) => registerScene(`ms06s${String(i + 1).padStart(2, '0')}`, ctx => MS.tip(ctx, { sec: 'Going for rides', icon: 'car', n: i + 1, ...o })));
})();
