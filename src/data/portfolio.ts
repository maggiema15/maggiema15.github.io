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
  image: string
  description: string | readonly ContentBlock[]
}

// Content and reading order only. Room placement belongs in room-layout.css.
export const portfolioSections: readonly PortfolioSection[] = [
  {
    id: 'about',
    title: 'About Me',
    image: aboutImage,
    description: [
      { type: 'paragraph', text: "I'm Maggie Ma, a third-year Computer Engineering student at the University of Toronto (B.A.Sc., PEY Co-op), focused on embedded systems, firmware, and hardware-software integration." },
      { type: 'paragraph', text: "I'm seeking a 12-16 month internship / PEY position starting in 2027." },
      { type: 'paragraph', text: "Based in Toronto, I'm open to opportunities across Canada and internationally, including remote and hybrid roles." },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    image: projectsImage,
    description: [
      { type: 'heading', text: 'AutoFlora - Smart Plant Care System' },
      { type: 'meta', text: 'Embedded Systems Personal Project | Aug. 2026 - Present' },
      { type: 'paragraph', text: "AutoFlora is a smart plant-care system I'm building around an STM32 microcontroller. The goal is to monitor a plant's environment and eventually make watering decisions automatically based on real sensor data rather than a fixed timer." },
      {
        type: 'list',
        items: [
          'I integrated an AHT20 temperature/humidity sensor and a BH1750 ambient-light sensor over a shared I2C bus, with UART serial output for monitoring and debugging.',
          "I'm also working with a capacitive soil-moisture sensor through the STM32's ADC and developing calibration and filtering logic to turn noisy analog readings into useful moisture measurements.",
          'The watering system is being designed around a 5 V pump controlled through a MOSFET, with safeguards including reservoir-level detection, pulse watering, soak periods, cooldown states, and fault handling.',
        ],
      },
      { type: 'paragraph', text: 'A large part of this project has been learning the full embedded-development workflow: configuring STM32 peripherals, writing and debugging firmware, reading datasheets, troubleshooting I2C devices and wiring, validating sensor output, and integrating hardware and software into one system.' },
      { type: 'meta', text: 'Technologies: STM32 | C/C++ | I2C | UART | ADC | AHT20 | BH1750 | Sensor Interfacing | CMake | STM32CubeMX' },

      { type: 'heading', text: 'CitySense - GIS Mapping & Navigation Application' },
      { type: 'meta', text: 'University of Toronto Engineering Project | Jan. 2026 - May 2026' },
      { type: 'paragraph', text: 'CitySense is an interactive C++ geographic information system developed as a team project at U of T. The application loads large map datasets and allows users to explore streets, intersections, buildings, points of interest, and navigation routes through an interactive map interface.' },
      {
        type: 'list',
        items: [
          'My work included implementing A* graph search for route planning, along with estimated travel times, highlighted routes, and readable turn-by-turn directions for both driving and walking.',
          'I also worked on the map-rendering system, including zoom-based level of detail, street prioritization, and bounding-box collision detection to prevent overlapping labels and unnecessary rendering.',
          'Other features developed across the project included real-time street search, intersection lookup, POI filtering, automatic map focusing, interactive tooltips, and customizable map themes.',
        ],
      },
      { type: 'paragraph', text: 'This project gave me experience working with a large C++ codebase, debugging interconnected features, designing algorithms around real datasets, using Git in a team environment, and balancing performance with usability.' },
      { type: 'meta', text: 'Technologies: C++ | A* Search | Graph Algorithms | GIS | Data Structures | UI Development | Git' },

      { type: 'heading', text: 'Brick Breaker - FPGA Game' },
      { type: 'meta', text: 'Digital Systems Project | Oct. 2025 - Nov. 2025' },
      { type: 'paragraph', text: 'I built a complete Brick Breaker game in Verilog and ran it on a DE1-SoC FPGA board with real-time VGA output.' },
      {
        type: 'list',
        items: [
          "The design included separate hardware modules for ball movement, paddle control, collision detection, brick behaviour, scoring, and overall game control. The modules were synchronized around the board's clock and combined to generate the game state and VGA display in real time.",
          'I used finite-state machines, digital logic, pixel mapping, and modular Verilog design to implement the system, then debugged timing and logic issues to improve display stability and gameplay behaviour.',
        ],
      },
      { type: 'paragraph', text: 'This was one of my first projects where something I wrote directly controlled physical hardware, and it helped spark my interest in embedded systems, FPGA development, and hardware-software systems.' },
      { type: 'meta', text: 'Technologies: Verilog | FPGA | DE1-SoC | VGA | Finite-State Machines | Digital Logic | Quartus Prime | ModelSim' },
    ],
  },
  {
    id: 'experience',
    title: 'Experience',
    image: experienceImage,
    description: [
      { type: 'heading', text: 'Development Engineer Intern' },
      { type: 'meta', text: 'Tianjin Shenzhou General Data Technology Co., Ltd. | Beijing, China' },
      { type: 'meta', text: 'May 2026 - Aug. 2026' },
      { type: 'paragraph', text: 'I worked with a development and QA team supporting client-facing software applications and the data used to test them.' },
      {
        type: 'list',
        items: [
          'A large part of my work involved writing SQL queries to retrieve, modify, validate, and organize test data. I prepared datasets for different testing scenarios, compared application behaviour against expected results, and helped identify issues during development.',
          'I also tested application features directly, documented bugs with reproducible steps, and retested fixes after changes were made.',
          'Beyond testing, I created technical and user documentation covering application workflows, testing procedures, expected behaviour, and troubleshooting steps.',
        ],
      },
      { type: 'paragraph', text: 'The role gave me experience working within an existing development process and seeing how software moves through implementation, testing, debugging, and delivery.' },
      { type: 'meta', text: 'Worked with: SQL | Software Testing | QA | Test Data | Bug Reporting | Technical Documentation' },

      { type: 'heading', text: 'Electronics Subteam Member' },
      { type: 'meta', text: 'U of T Human Powered Vehicles Design Team | Toronto, ON' },
      { type: 'meta', text: 'Sep. 2025 - Present' },
      { type: 'paragraph', text: "I work on the electronics systems used in the University of Toronto Human Powered Vehicles Design Team's vehicles." },
      {
        type: 'list',
        items: [
          'My work has included prototyping control circuits, working with breadboards and electronic components, and using KiCad for PCB schematic and layout development.',
          'I have also worked with sensors and microcontrollers using interfaces such as I2C and SPI, including hardware assembly, soldering, testing, and debugging.',
          'Because the electronics are part of a complete vehicle, the work involves collaborating with mechanical and software members to make sure interfaces, components, and system behaviour work together correctly.',
        ],
      },
      { type: 'paragraph', text: 'The team has given me hands-on experience beyond coursework and is one of the reasons I became interested in embedded electronics and hardware integration.' },
      { type: 'meta', text: 'Worked with: KiCad | PCB Design | I2C | SPI | Sensors | Microcontrollers | Circuit Prototyping | Hardware Debugging' },

      { type: 'heading', text: 'STEM Annotator & Quality Analyst' },
      { type: 'meta', text: 'Turning Internship | Remote' },
      { type: 'meta', text: 'May 2025 - Aug. 2025' },
      { type: 'paragraph', text: 'I worked on evaluation and annotation projects involving large language models and conversational AI.' },
      {
        type: 'list',
        items: [
          'My work included analyzing benchmark datasets and model outputs, comparing evaluation results, identifying model strengths and weaknesses, and contributing to projects delivered for organizations including OpenAI and Google.',
          'I also helped coordinate communication and task allocation across a distributed team of more than 50 people.',
        ],
      },
      { type: 'paragraph', text: 'The experience introduced me to large-scale AI evaluation workflows and gave me experience working remotely on projects where consistency, detailed analysis, and clear communication were important.' },
      { type: 'meta', text: 'Worked with: LLM Evaluation | Data Annotation | Benchmark Analysis | Quality Assurance | Remote Collaboration' },
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    image: skillsImage,
    description: [
      { type: 'heading', text: 'Programming' },
      { type: 'meta', text: 'C | C++ | Python | JavaScript | TypeScript | HTML/CSS | Verilog | RISC-V Assembly' },
      { type: 'paragraph', text: "I primarily use C and C++ for embedded systems, systems programming, and engineering projects. I've also worked with Verilog for FPGA development, Python for scripting and technical work, and JavaScript/TypeScript for web development." },

      { type: 'heading', text: 'Embedded Systems & Hardware' },
      { type: 'meta', text: 'STM32 | FPGA | Embedded Systems | Microcontrollers | Sensor Interfacing | PCB Design | Digital Logic' },
      { type: 'paragraph', text: "I'm most interested in the point where software meets hardware. My experience includes configuring and programming STM32 microcontrollers, interfacing sensors, working with FPGA designs, prototyping circuits, and debugging electronics." },

      { type: 'heading', text: 'Communication & Interfaces' },
      { type: 'meta', text: 'I2C | SPI | UART | ADC' },
      { type: 'paragraph', text: "I've used common embedded communication interfaces to connect microcontrollers with sensors and peripherals, including debugging device addresses, wiring, initialization, communication failures, and sensor data conversion." },

      { type: 'heading', text: 'Electronics & Digital Design' },
      { type: 'meta', text: 'KiCad | PCB Schematics | PCB Layout | Circuit Prototyping | FPGA Design | Verilog | Finite-State Machines' },
      { type: 'paragraph', text: 'My hardware experience includes designing and prototyping circuits, creating PCB schematics and layouts in KiCad, and developing digital systems in Verilog for FPGA hardware.' },

      { type: 'heading', text: 'Development Tools' },
      { type: 'meta', text: 'Git | CMake | STM32CubeMX | VS Code | Quartus Prime | ModelSim | DESim | MATLAB' },
      { type: 'paragraph', text: 'I use Git for version control and have worked with toolchains for both embedded and FPGA development, including STM32CubeMX/CMake for STM32 projects and Quartus/ModelSim for digital-system development.' },

      { type: 'heading', text: "Areas I'm Interested In" },
      { type: 'meta', text: 'Embedded Systems | Firmware | Hardware-Software Integration | FPGA / Digital Systems | Robotics | Automotive & EV Systems | Hardware Validation & Testing | System Integration' },
      { type: 'paragraph', text: "I'm particularly drawn to engineering roles where I can work with a complete system rather than only one isolated layer - writing software, understanding the hardware underneath it, testing the result, and debugging problems across the boundary between the two." },
    ],
  },
  {
    id: 'albums',
    title: 'Top 100 Albums',
    image: albumsImage,
    description: 'A personal ranking of favorite albums will appear here.',
  },
]
