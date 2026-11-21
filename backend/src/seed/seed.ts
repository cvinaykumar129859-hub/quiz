import 'dotenv/config';
import mongoose from 'mongoose';
import { Quiz } from '../models/Quiz';

const catalog: Record<string, Array<[string, string]>> = {
  Programming: [
    ['a variable and its type', 'A named binding refers to a value, while its type determines which operations are valid.'],
    ['a function', 'A reusable block accepts inputs, performs a defined task, and may return a value.'],
    ['an array', 'An ordered collection stores elements that can be accessed by their positions.'],
    ['a loop', 'A control structure repeats a block while a condition holds or for each item in a range.'],
    ['recursion', 'A function solves a problem through smaller calls and stops when it reaches a base case.'],
    ['encapsulation', 'An object hides implementation details and exposes a controlled interface to its state.'],
    ['exception handling', 'A program catches or propagates runtime failures so they can be reported or recovered from.'],
    ['Big O notation', 'An asymptotic measure describes how an algorithm\'s resource use grows with input size.'],
    ['a unit test', 'A small automated check verifies the behavior of one isolated function or component.'],
    ['async and await', 'Language syntax allows promise-based work to be written in a readable, sequential style.']
  ],
  'Web Development': [
    ['semantic HTML', 'Elements such as main, nav, and article communicate the structure and meaning of page content.'],
    ['the CSS box model', 'An element\'s rendered box is composed of content, padding, border, and margin.'],
    ['the CSS cascade', 'Competing style rules are resolved using origin, importance, specificity, and source order.'],
    ['event bubbling in the DOM', 'An event can propagate from its target through ancestor elements toward the document.'],
    ['a responsive layout', 'CSS rules adapt content arrangement to available viewport space and device capabilities.'],
    ['CORS', 'A server policy tells browsers which other origins may read its cross-origin responses.'],
    ['an accessible name', 'A label or equivalent semantic text gives assistive technology the purpose of a control.'],
    ['HTTP caching', 'Freshness directives let browsers or intermediaries reuse a response without fetching it again.'],
    ['client-side routing', 'A browser application changes views from the URL without requesting a new document for every route.'],
    ['TLS for a website', 'Transport Layer Security encrypts a connection and helps authenticate the server identity.']
  ],
  Cybersecurity: [
    ['multi-factor authentication', 'A login requires evidence from at least two different factor categories.'],
    ['password hashing', 'A one-way derivation stores a verifier that can be checked without retaining the original password.'],
    ['a unique salt', 'Random per-password data prevents identical passwords from producing identical stored hashes.'],
    ['symmetric encryption', 'The same secret key is used to encrypt data and decrypt it.'],
    ['SQL injection prevention', 'Parameterized queries keep untrusted input separate from the SQL statement structure.'],
    ['cross-site scripting defense', 'Context-aware output encoding prevents untrusted text from becoming executable browser code.'],
    ['least privilege', 'Each account or service receives only the permissions needed for its specific tasks.'],
    ['a digital certificate', 'A trusted signature binds a public key to an identified subject or domain.'],
    ['network segmentation', 'Separating systems into controlled zones limits unnecessary paths and lateral movement.'],
    ['an incident response plan', 'A defined process coordinates preparation, detection, containment, recovery, and learning.']
  ],
  'Database Management': [
    ['a primary key', 'A column or column set uniquely identifies each row in a table.'],
    ['a foreign key', 'A constraint requires a referenced value to correspond to a row in another relation.'],
    ['normalization', 'Relations are structured to reduce duplicated facts and update anomalies.'],
    ['an ACID transaction', 'A unit of work aims for atomicity, consistency, isolation, and durability.'],
    ['a database index', 'An auxiliary data structure can speed lookups at the cost of storage and write work.'],
    ['a join', 'A query combines related rows from multiple tables using a matching condition.'],
    ['transaction isolation', 'A database level controls which concurrent transaction changes are visible to a transaction.'],
    ['replication', 'Copies of data are maintained on multiple database nodes for availability or read capacity.'],
    ['sharding', 'A dataset is horizontally partitioned across machines using a routing key.'],
    ['a recovery point objective', 'A backup target states the maximum acceptable amount of data loss measured in time.']
  ],
  'General Knowledge': [
    ['photosynthesis', 'Plants use light energy to convert carbon dioxide and water into sugars and oxygen.'],
    ['the water cycle', 'Water continually moves through evaporation, condensation, precipitation, and collection.'],
    ['latitude', 'Angular distance north or south of the equator is measured in parallel lines.'],
    ['the greenhouse effect', 'Atmospheric gases absorb and re-emit some outgoing infrared radiation, warming the lower atmosphere.'],
    ['separation of powers', 'Government authority is divided among branches so no single branch holds all state power.'],
    ['supply and demand', 'In a competitive market, price and quantity are influenced by buyers\' demand and sellers\' supply.'],
    ['the circulatory system', 'The heart and blood vessels move blood that transports oxygen, nutrients, and waste products.'],
    ['a renewable energy source', 'A naturally replenished resource can provide energy on a human timescale.'],
    ['the scientific method', 'A testable hypothesis is evaluated through observation or experiment and revised using evidence.'],
    ['an orbit', 'An object follows a curved path around another body under the influence of gravity.']
  ],
  'Aptitude and Reasoning': [
    ['a ratio', 'A comparison of two quantities can be expressed as a quotient or as a:b.'],
    ['percentage change', 'The difference between final and initial values is divided by the initial value and multiplied by 100.'],
    ['an arithmetic mean', 'The sum of a set of values is divided by the number of values.'],
    ['a work-rate problem', 'When rates are constant, the amount of work completed equals rate multiplied by time.'],
    ['independent events', 'The occurrence of one event does not change the probability of the other event.'],
    ['a number sequence rule', 'A consistent operation or relationship generates each term from earlier terms or its position.'],
    ['average speed', 'Total distance traveled is divided by total elapsed time.'],
    ['a valid deduction', 'If the premises are true, the conclusion must follow from their logical structure.'],
    ['a permutation', 'An arrangement counts selections where changing the order produces a different outcome.'],
    ['compound interest', 'Interest is calculated on the principal and on interest previously added to the balance.']
  ],
  'Operating Systems': [
    ['a process', 'A running program instance has its own execution state and allocated resources.'],
    ['a thread', 'A schedulable execution path shares a process address space with its sibling threads.'],
    ['preemptive scheduling', 'The operating system can interrupt a running task to give another task processor time.'],
    ['virtual memory paging', 'Fixed-size pages map virtual addresses to physical frames and can be moved between memory and storage.'],
    ['a system call', 'A controlled interface lets a program request a privileged service from the operating system.'],
    ['user mode', 'Restricted execution prevents ordinary application code from directly performing privileged operations.'],
    ['a mutex', 'A mutual-exclusion lock allows one thread at a time into a protected critical section.'],
    ['deadlock', 'Tasks wait indefinitely because each holds a resource needed by another task in a cycle.'],
    ['a device driver', 'System software translates operating-system requests into operations understood by a device.'],
    ['file permissions', 'Access-control bits or rules determine which users may read, modify, or execute a file.']
  ],
  'Computer Networks': [
    ['DNS resolution', 'A resolver looks up records that map a domain name to network information such as an IP address.'],
    ['the TCP three-way handshake', 'A client and server synchronize sequence numbers using SYN, SYN-ACK, and ACK messages.'],
    ['an IP subnet mask', 'A bit mask separates the network prefix of an IP address from its host portion.'],
    ['a router', 'A network-layer device forwards packets between networks using destination addresses and routes.'],
    ['an Ethernet switch', 'A data-link device forwards frames within a LAN based on learned MAC addresses.'],
    ['DHCP', 'A server can automatically lease hosts their IP configuration, including address, gateway, and DNS settings.'],
    ['NAT', 'A gateway rewrites address information to map traffic between private and external address spaces.'],
    ['HTTPS', 'HTTP is carried over a TLS-protected connection to provide confidentiality and server authentication.'],
    ['a VLAN', 'Logical LAN segmentation separates broadcast domains over shared switching infrastructure.'],
    ['congestion control', 'A transport protocol adjusts its sending rate to avoid overwhelming the network path.']
  ]
};
const difficulties = ['Easy', 'Moderate', 'Difficult'] as const;
const categories = Object.keys(catalog);

function makeQuestions(difficulty: typeof difficulties[number], facts: Array<[string, string]>) {
  return facts.map(([topic, definition], index) => {
    const distractors = [1, 2, 3].map(offset => facts[(index + offset * 3) % facts.length][1]);
    const options = [definition, ...distractors];
    const correctAnswer = (index * 3 + difficulties.indexOf(difficulty)) % 4;
    const shuffled = [...options];
    [shuffled[0], shuffled[correctAnswer]] = [shuffled[correctAnswer], shuffled[0]];
    const prompt = difficulty === 'Easy'
      ? `Which statement best describes ${topic}?`
      : difficulty === 'Moderate'
        ? `A practitioner uses ${topic} in a real task. Which statement explains its role?`
        : `When diagnosing a complex system, which explanation accurately characterizes ${topic}?`;
    return { text: prompt, options: shuffled, correctAnswer, explanation: definition };
  });
}

async function seed(): Promise<void> {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required to seed the database');
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'quizmaster_db' });
  const quizzes = categories.flatMap(category => difficulties.map(difficulty => ({
    title: `${category} ${difficulty}`,
    category,
    difficulty,
    description: `${difficulty} questions covering core ${category.toLowerCase()} concepts.`,
    questions: makeQuestions(difficulty, catalog[category])
  })));
  for (const quiz of quizzes) {
    await Quiz.findOneAndUpdate(
      { category: quiz.category, difficulty: quiz.difficulty },
      { $set: quiz },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${quizzes.length} quizzes and ${quizzes.length * 10} questions.`);
  await mongoose.disconnect();
}

seed().catch(async error => { console.error(error); await mongoose.disconnect(); process.exit(1); });
