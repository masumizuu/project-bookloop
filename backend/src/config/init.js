const { initializeSequelize, getSequelizeInstance } = require('./db');
const initModels = require('../models');
const bcrypt = require('bcryptjs');

const initApp = async () => {
    try {
        await initializeSequelize();
        const sequelize = await getSequelizeInstance();
        const models = await initModels(sequelize);

        // Sync database with models
        await sequelize.sync({ alter: true });
        console.log('✅ Models synced successfully.');

        // Seed initial data
        await seedInitialData(models);

        // ✅ Start app.js automatically after initialization
        require('../app');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }
};

// Function to seed initial data
const seedInitialData = async (models) => {
    const { User, Book } = models;

    // Ensure default admin exists
    const adminExists = await User.findOne({ where: { email: 'admin@bookloop.com' } });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await User.create({
            first_name: 'Champagne',
            last_name: 'Gonzales',
            email: 'admin@bookloop.com',
            password: hashedPassword, // Now it's hashed
            user_type: 'ADMIN'
        });
        console.log('✅ Default Admin Created.');
    }

    // Ensure normal user exists
    const userExists = await User.findOne({ where: { email: 'ceanne@bookloop.com' } });
    if (!userExists) {
        const hashedPassword = await bcrypt.hash('1234', 10);
        await User.create({
            first_name: 'Ceanne',
            last_name: 'User',
            email: 'ceanne@bookloop.com',
            password: hashedPassword,
            user_type: 'USER'
        });
        console.log('✅ User Ceanne Created.');
    }

    // Ensure books exist
    const books = await Book.findAll();
    if (books.length === 0) {
        const initialBooks = [
            // Fantasy
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                genre: "Fantasy",
                publication_date: "1937-09-21",
                cover_image: "/covers/the-hobbit.jpg",
                synopsis: "Bilbo Baggins, a humble hobbit, is swept into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the dragon Smaug. Along the way, he faces trolls, goblins, and a mysterious ring that will change Middle-earth forever.",
                owner_id: 1,
            },
            {
                title: "Harry Potter and the Sorcerer’s Stone",
                author: "J.K. Rowling",
                genre: "Fantasy",
                publication_date: "1997-06-26",
                cover_image: "/covers/harry-potter-and-the-sorcerer-stone.jpg",
                synopsis: "A young boy, Harry Potter, discovers he is a wizard and attends Hogwarts School of Witchcraft and Wizardry, where he learns magic, makes friends, and faces the dark past that connects him to the villain, Lord Voldemort.",
                owner_id: 1,
            },
            {
                title: "A Game of Thrones",
                author: "George R.R. Martin",
                genre: "Fantasy",
                publication_date: "1996-08-06",
                cover_image: "/covers/game-of-thrones.jpg",
                synopsis: "The Seven Kingdoms of Westeros are in a struggle for power as noble families vie for the Iron Throne. Meanwhile, a threat from beyond the Wall could bring the kingdom to ruin.",
                status: "Borrowed",
                owner_id: 1,
            },
            {
                title: "The Complete Cthulhu Mythos Tales",
                author: "H.P. Lovecraft",
                genre: "Fantasy",
                publication_date: "1940-01-01",
                cover_image: "/covers/the-complete-cthulhu-mythos-tales.jpg",
                synopsis: "The Cthulhu Mythos was H. P. Lovecraft's greatest contribution to supernatural literature: a series of stories that evoked cosmic awe and terror through their accounts of incomprehensibly alien monsters and their horrifying incursions into our world.",
                owner_id: 2,
            },

            // Mystery/Thriller
            {
                title: "The Girl with the Dragon Tattoo",
                author: "Stieg Larsson",
                genre: "Mystery/Thriller",
                publication_date: "2005-08-01",
                cover_image: "/covers/the-girl-with-the-dragon-tattoo.jpg",
                synopsis: "A journalist and a brilliant hacker team up to solve the decades-old mystery of a missing girl, uncovering dark secrets in a powerful Swedish family.",
                owner_id: 1,
            },
            {
                title: "Gone Girl",
                author: "Gillian Flynn",
                genre: "Mystery/Thriller",
                publication_date: "2012-06-05",
                cover_image: "/covers/gone-girl.jpg",
                synopsis: "When Amy Dunne goes missing on her wedding anniversary, suspicion falls on her husband, Nick. As the story unfolds, shocking truths about their marriage and Amy’s disappearance emerge.",
                owner_id: 1,
            },
            {
                title: "The Da Vinci Code",
                author: "Dan Brown",
                genre: "Mystery/Thriller",
                publication_date: "2003-03-18",
                cover_image: "/covers/the-da-vinci-code.jpg",
                synopsis: "A symbologist and a cryptologist race against time to decipher hidden messages in famous artworks, leading them to uncover a secret that could shake the foundations of history.",
                owner_id: 1,
            },
            {
                title: "I'm Thinking of Ending Things",
                author: "Iain Reid",
                genre: "Mystery/Thriller",
                publication_date: "2016-06-14",
                cover_image: "/covers/im-thinking-of-ending-things.jpg",
                synopsis: "In this smart and intense literary suspense novel, Iain Reid explores the depths of the human psyche, questioning consciousness, free will, the value of relationships, fear, and the limitations of solitude. Tense, gripping, and atmospheric, I’m Thinking of Ending Things pulls you in from the very first page…and never lets you go.",
                owner_id: 2,
            },

            // Romance
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                genre: "Romance",
                publication_date: "1813-01-28",
                cover_image: "/covers/pride-and-prejudice.jpg",
                synopsis: "Elizabeth Bennet navigates love, class, and societal expectations as she clashes with the proud Mr. Darcy in 19th-century England.",
                owner_id: 1,
            },
            {
                title: "The Notebook",
                author: "Nicholas Sparks",
                genre: "Romance",
                publication_date: "1996-10-01",
                cover_image: "/covers/the-notebook.jpg",
                synopsis: "A heartfelt love story of Noah and Allie, who are separated by social class but reunite years later, proving the power of true love.",
                owner_id: 1,
            },
            {
                title: "Me Before You",
                author: "Jojo Moyes",
                genre: "Romance",
                publication_date: "2012-01-05",
                cover_image: "/covers/me-before-you.jpg",
                synopsis: "Louisa Clark takes a job as a caregiver for Will Traynor, a wealthy man left paralyzed after an accident. Their unexpected romance changes both their lives forever.",
                owner_id: 1,
            },
            {
                title: "13 Going on 30",
                author: "Christa Roberts",
                genre: "Romance",
                publication_date: "2004-04-13",
                cover_image: "/covers/13-going-on-30.jpg",
                synopsis: "All Jenna Rink wants to be is pretty and popular. And on her thirteenth birthday, she gets her wish. When she wakes up, Jenna is stunned to find that she's . . . a grown-up! Read the novel based on the hilarious movie starring Jennifer Garner.",
                owner_id: 2,
            },

            // Adventure
            {
                title: "Treasure Island",
                author: "Robert Louis Stevenson",
                genre: "Adventure",
                publication_date: "1883-11-14",
                cover_image: "/covers/treasure-island.jpg",
                synopsis: "Young Jim Hawkins embarks on a thrilling quest for buried treasure, facing pirates and betrayal on the high seas.",
                owner_id: 1,
            },
            {
                title: "The Call of the Wild",
                author: "Jack London",
                genre: "Adventure",
                publication_date: "1903-01-01",
                cover_image: "/covers/the-call-of-the-wild.jpg",
                synopsis: "A domesticated dog, Buck, is thrust into the wild Alaskan Yukon during the Klondike Gold Rush and must embrace his primal instincts to survive.",
                owner_id: 1,
            },
            {
                title: "Life of Pi",
                author: "Yann Martel",
                genre: "Adventure",
                publication_date: "2001-09-11",
                cover_image: "/covers/life-of-pi.jpg",
                synopsis: "After a shipwreck, Pi Patel finds himself stranded on a lifeboat with a Bengal tiger, facing an extraordinary battle for survival.",
                owner_id: 1,
            },
            {
                title: "Executive Orders",
                author: "Tom Clancy",
                genre: "Adventure",
                publication_date: "1996-07-01",
                cover_image: "/covers/executive-orders.jpg",
                synopsis: "The President is dead—and the weight, literally, of the world falls on Jack Ryan's shoulders, in Tom Clancy's newest and most extraordinary novel. I don't know what to do. Where's the manual, the training course, for this job? Whom do I ask? Where do I go? Debt of Honor ended with Tom Clancy's most shocking conclusion ever; a joint session of Congress destroyed, the President dead, most of the Cabinet and the Congress dead, the Supreme Court and the Joint Chiefs likewise. Dazed and confused, the man who only minutes before had been confirmed as the new Vice-President of the United States is told that he is now President. President John Patrick Ryan. And that is where Executive Orders begins. ",
                owner_id: 2,
            },

            // Historical
            {
                title: "The Book Thief",
                author: "Markus Zusak",
                genre: "Historical",
                publication_date: "2005-03-14",
                cover_image: "/covers/the-book-thief.jpg",
                synopsis: "During WWII, a young girl named Liesel steals books and shares them with others while living in Nazi Germany, narrated by Death itself.",
                owner_id: 1,
            },
            {
                title: "The Nightingale",
                author: "Kristin Hannah",
                genre: "Historical",
                publication_date: "2015-02-03",
                cover_image: "/covers/the-nightingale.jpg",
                synopsis: "Two sisters in Nazi-occupied France take different paths to resist the war—one joins the fight, while the other struggles to protect her family.",
                owner_id: 1,
            },
            {
                title: "All the Light We Cannot See",
                author: "Anthony Doerr",
                genre: "Historical",
                publication_date: "2014-05-06",
                cover_image: "/covers/all-the-light-we-cannot-see.jpg",
                synopsis: "The lives of a blind French girl and a German soldier intertwine during WWII, revealing the resilience of hope amidst war.",
                owner_id: 1,
            },
            {
                title: "A Place Called Freedom",
                author: "Ken Follett",
                genre: "Historical",
                publication_date: "1995-08-28",
                cover_image: "/covers/a-place-called-freedom.jpg",
                synopsis: "Scotland, 1766. Sentenced to a life of misery in the brutal coal mines, twenty-one-year-old Mack McAsh hungers for escape. His only ally: the beautiful, highborn Lizzie Hallim, who is trapped in her own kind of hell. Though separated by politics and position, these two restless young people are bound by their passionate search for a place called freedom.",
                owner_id: 2,
            },

            // Educational
            {
                title: "Calculus: Early Transcendentals",
                author: "James Stewart",
                genre: "Educational",
                publication_date: "1987-01-01",
                cover_image: "/covers/calculus-early-transcendentals.jpg",
                synopsis: "This widely used calculus textbook provides clear explanations, real-world applications, and step-by-step problem-solving techniques, making it ideal for high school and college students.",
                status: "Borrowed",
                borrowedCount: 35,
                owner_id: 1,
            },
            {
                title: "Conceptual Physics",
                author: "Paul G. Hewitt",
                genre: "Educational",
                publication_date: "1971-01-01",
                cover_image: "/covers/conceptual-physics.jpg",
                synopsis: "This book simplifies physics concepts using real-world analogies, visuals, and engaging explanations, making it accessible to students with little math background.",
                status: "Borrowed",
                borrowedCount: 567,
                owner_id: 1,
            },
            {
                title: "Computer Science: An Interdisciplinary Approach",
                author: "Robert Sedgewick & Kevin Wayne",
                genre: "Educational",
                publication_date: "2016-04-19",
                cover_image: "/covers/computer-science-an-interdisciplinary-approach.jpg",
                synopsis: "This book introduces fundamental programming concepts, algorithms, and data structures while integrating computer science with real-world applications, making it a great starting point for students.",
                status: "Borrowed",
                borrowedCount: 91,
                owner_id: 1,
            }
        ];

        await Book.bulkCreate(initialBooks);
        console.log('✅ Initial books added.');
    }
};

// Run initialization
initApp();
