import aboutImage from '../assests/Abbey Road.png'
import projectsImage from '../assests/The Dark Side of the Moon.png'
import experienceImage from '../assests/In Utero.png'
import skillsImage from '../assests/Weezer.png'
import albumsImage from '../assests/Currents.png'

export type SectionId = 'about' | 'projects' | 'experience' | 'skills' | 'albums'

export type ContentBlock =
  | { type: 'heading' | 'paragraph' | 'meta'; text: string }
  | { type: 'list'; items: readonly string[] }

export type PortfolioSection = {
  id: SectionId
  title: string
  subtitle: string
  image: string
  description: string | readonly ContentBlock[]
}

// Content and reading order only. Room placement belongs in room-layout.css.
export const portfolioSections: readonly PortfolioSection[] = [
  {
    id: 'about',
    title: 'About Me',
    subtitle: "A little about me and what I'm looking for.",
    image: aboutImage,
    description: [
      { type: 'paragraph', text: 'Third-year Computer Engineering student at the University of Toronto (B.A.Sc., PEY Co-op), focused on embedded systems, firmware, and hardware-software integration.' },
      { type: 'paragraph', text: 'Seeking a 12–16 month internship or PEY position starting in 2027. Based in Toronto and open to roles across Canada, internationally, or remotely.' },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    subtitle: "A few things I've designed, built, and debugged.",
    image: projectsImage,
    description: [
      { type: 'heading', text: 'AutoFlora - Smart Plant Care System' },
      { type: 'meta', text: 'Embedded Systems Personal Project | Aug. 2026 - Present' },
      { type: 'paragraph', text: 'STM32-based system that monitors plant conditions and automates watering from sensor data.' },
      {
        type: 'list',
        items: [
          'Integrated AHT20 temperature/humidity and BH1750 light sensors on a shared I2C bus, with UART output for monitoring and debugging.',
          'Read a capacitive soil-moisture sensor through the ADC and developed calibration and filtering for noisy analog data.',
          'Designed MOSFET-controlled 5 V pump logic with reservoir detection, pulse watering, soak and cooldown states, and fault handling.',
        ],
      },
      { type: 'meta', text: 'STM32 | C/C++ | I2C | UART | ADC | CMake | STM32CubeMX' },

      { type: 'heading', text: 'CitySense - GIS Mapping & Navigation Application' },
      { type: 'meta', text: 'University of Toronto Engineering Project | Jan. 2026 - May 2026' },
      { type: 'paragraph', text: 'Team-built C++ GIS and navigation application for exploring large map datasets.' },
      {
        type: 'list',
        items: [
          'Implemented A* route planning for driving and walking, including travel-time estimates, highlighted paths, and turn-by-turn directions.',
          'Built zoom-aware rendering, street prioritization, and label collision detection, plus street search, POI filtering, tooltips, and map themes.',
        ],
      },
      { type: 'meta', text: 'C++ | A* Search | Graph Algorithms | GIS | Git' },

      { type: 'heading', text: 'Brick Breaker - FPGA Game' },
      { type: 'meta', text: 'Digital Systems Project | Oct. 2025 - Nov. 2025' },
      { type: 'paragraph', text: 'Brick Breaker implemented in Verilog on a DE1-SoC FPGA with real-time VGA output.' },
      {
        type: 'list',
        items: [
          'Developed clock-synchronized modules for ball movement, paddle control, collision detection, bricks, scoring, and game state.',
          'Used finite-state machines and pixel mapping; debugged timing and logic issues to stabilize display and gameplay.',
        ],
      },
      { type: 'meta', text: 'Verilog | FPGA | DE1-SoC | VGA | Quartus Prime | ModelSim' },
    ],
  },
  {
    id: 'experience',
    title: 'Experience',
    subtitle: "Where I've worked and what I contributed.",
    image: experienceImage,
    description: [
      { type: 'heading', text: 'Development Engineer Intern' },
      { type: 'meta', text: 'Tianjin Shenzhou General Data Technology Co., Ltd. | Beijing, China' },
      { type: 'meta', text: 'May 2026 - Aug. 2026' },
      {
        type: 'list',
        items: [
          'Wrote SQL queries to retrieve, modify, validate, and organize test data for client-facing applications.',
          'Tested features, documented reproducible bugs, and verified fixes.',
          'Created technical and user documentation for workflows, testing, and troubleshooting.',
        ],
      },
      { type: 'meta', text: 'SQL | Software Testing | QA | Bug Reporting | Technical Documentation' },

      { type: 'heading', text: 'Electronics Subteam Member' },
      { type: 'meta', text: 'U of T Human Powered Vehicles Design Team | Toronto, ON' },
      { type: 'meta', text: 'Sep. 2025 - Present' },
      {
        type: 'list',
        items: [
          'Prototyped control circuits and developed PCB schematics and layouts in KiCad.',
          'Integrated sensors and microcontrollers over I2C and SPI; assembled, soldered, tested, and debugged hardware.',
          'Coordinated hardware interfaces with mechanical and software subteams.',
        ],
      },
      { type: 'meta', text: 'KiCad | PCB Design | I2C | SPI | Microcontrollers | Hardware Debugging' },

      { type: 'heading', text: 'STEM Annotator & Quality Analyst' },
      { type: 'meta', text: 'Turning Internship | Remote' },
      { type: 'meta', text: 'May 2025 - Aug. 2025' },
      {
        type: 'list',
        items: [
          'Analyzed benchmark datasets and model outputs for conversational-AI evaluation projects delivered to OpenAI and Google.',
          'Coordinated communication and task allocation across a distributed team of more than 50 people.',
        ],
      },
      { type: 'meta', text: 'LLM Evaluation | Data Annotation | Benchmark Analysis | Quality Assurance' },
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    subtitle: 'The tools and technologies I use to build things.',
    image: skillsImage,
    description: [
      { type: 'heading', text: 'Programming' },
      { type: 'meta', text: 'C | C++ | Python | JavaScript | TypeScript | HTML/CSS | Verilog | RISC-V Assembly' },

      { type: 'heading', text: 'Embedded Systems & Hardware' },
      { type: 'meta', text: 'STM32 | FPGA | Microcontrollers | Sensor Interfacing | PCB Design | Digital Logic | Circuit Prototyping' },

      { type: 'heading', text: 'Interfaces' },
      { type: 'meta', text: 'I2C | SPI | UART | ADC' },

      { type: 'heading', text: 'Development Tools' },
      { type: 'meta', text: 'Git | CMake | STM32CubeMX | VS Code | Quartus Prime | ModelSim | DESim | MATLAB' },

      { type: 'heading', text: 'Interests' },
      { type: 'meta', text: 'Embedded Systems | Firmware | Hardware-Software Integration | FPGA | Robotics | Automotive & EV Systems | Hardware Validation' },
    ],
  },
  {
    id: 'albums',
    title: 'Top 100 Albums',
    subtitle: 'The records I keep coming back to.',
    image: albumsImage,
    description: 'Ranking coming soon.',
  },
]
