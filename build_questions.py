"""
Build the quiz question bank.

Holds the raw questions (correct answer + distractors), shuffles the options for
each one, records the index of the correct answer, and writes everything to
data.json — which the static frontend loads. Keeping the bank here means the
options are shuffled once at build time and the answer key never ships in an
obvious order.

Run:  python build_questions.py   ->   data.json
"""

import json
import random

random.seed(42)

# (category, question, correct, [distractors...])
RAW = [
    # --- Geography ---
    ("Geography", "What is the capital of Australia?", "Canberra", ["Sydney", "Melbourne", "Perth"]),
    ("Geography", "Which is the largest ocean on Earth?", "Pacific", ["Atlantic", "Indian", "Arctic"]),
    ("Geography", "What is the capital of Canada?", "Ottawa", ["Toronto", "Vancouver", "Montreal"]),
    ("Geography", "Which country is the largest by land area?", "Russia", ["Canada", "China", "United States"]),
    ("Geography", "Mount Everest lies in which mountain range?", "Himalayas", ["Andes", "Alps", "Rockies"]),
    ("Geography", "What is the capital of Brazil?", "Brasília", ["Rio de Janeiro", "São Paulo", "Salvador"]),
    ("Geography", "How many continents are there?", "7", ["5", "6", "8"]),
    ("Geography", "The Sahara Desert is on which continent?", "Africa", ["Asia", "Australia", "South America"]),

    # --- Science ---
    ("Science", "What is the chemical symbol for gold?", "Au", ["Ag", "Gd", "Go"]),
    ("Science", "Which planet is known as the Red Planet?", "Mars", ["Venus", "Jupiter", "Mercury"]),
    ("Science", "Which gas do plants absorb from the air?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Hydrogen"]),
    ("Science", "How many bones are in the adult human body?", "206", ["201", "212", "198"]),
    ("Science", "What is the powerhouse of the cell?", "Mitochondria", ["Nucleus", "Ribosome", "Chloroplast"]),
    ("Science", "Which planet is closest to the Sun?", "Mercury", ["Venus", "Earth", "Mars"]),
    ("Science", "What is the pH of pure water?", "7", ["0", "10", "14"]),
    ("Science", "What force pulls objects toward Earth?", "Gravity", ["Magnetism", "Friction", "Inertia"]),

    # --- History ---
    ("History", "In which year did World War II end?", "1945", ["1939", "1918", "1950"]),
    ("History", "Who was the first person to walk on the Moon?", "Neil Armstrong", ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins"]),
    ("History", "Which empire built the Colosseum?", "Roman", ["Greek", "Ottoman", "Persian"]),
    ("History", "In which year did the Berlin Wall fall?", "1989", ["1991", "1985", "1979"]),
    ("History", "When did the Titanic sink?", "1912", ["1905", "1920", "1898"]),
    ("History", "Who was the first President of the United States?", "George Washington", ["Thomas Jefferson", "Abraham Lincoln", "John Adams"]),
    ("History", "In which country did the Renaissance begin?", "Italy", ["France", "England", "Spain"]),
    ("History", "The Great Pyramid was built in which country?", "Egypt", ["Mexico", "Greece", "Iraq"]),

    # --- Math ---
    ("Math", "What is 7 × 8?", "56", ["54", "64", "48"]),
    ("Math", "What is the square root of 144?", "12", ["11", "14", "13"]),
    ("Math", "How many sides does a hexagon have?", "6", ["5", "7", "8"]),
    ("Math", "What is 15% of 200?", "30", ["20", "35", "25"]),
    ("Math", "What is 2 to the power of 10?", "1024", ["512", "2048", "1000"]),
    ("Math", "The angles inside a triangle add up to?", "180°", ["90°", "270°", "360°"]),
    ("Math", "What is the Roman numeral for 50?", "L", ["C", "X", "D"]),
    ("Math", "Which of these is a prime number?", "11", ["9", "15", "21"]),

    # --- Arts & Culture ---
    ("Arts", "Who painted the Mona Lisa?", "Leonardo da Vinci", ["Michelangelo", "Raphael", "Donatello"]),
    ("Arts", "Who painted 'The Starry Night'?", "Vincent van Gogh", ["Claude Monet", "Pablo Picasso", "Salvador Dalí"]),
    ("Arts", "How many keys does a standard piano have?", "88", ["76", "61", "100"]),
    ("Arts", "In which city is the Louvre museum?", "Paris", ["London", "Rome", "Madrid"]),
    ("Arts", "Who wrote the play 'Romeo and Juliet'?", "William Shakespeare", ["Charles Dickens", "Mark Twain", "Jane Austen"]),
    ("Arts", "How many strings does a standard guitar have?", "6", ["4", "7", "5"]),
    ("Arts", "Who composed 'Ode to Joy'?", "Ludwig van Beethoven", ["Mozart", "Bach", "Chopin"]),
    ("Arts", "Who is the author of the Harry Potter books?", "J.K. Rowling", ["Stephen King", "Tolkien", "Roald Dahl"]),
]


def main():
    questions = []
    for category, q, correct, distractors in RAW:
        options = [correct] + distractors
        random.shuffle(options)
        questions.append({
            "category": category,
            "q": q,
            "options": options,
            "answer": options.index(correct),
        })

    categories = sorted({r[0] for r in RAW})
    data = {"categories": categories, "count": len(questions), "questions": questions}

    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    per = {c: sum(1 for x in questions if x["category"] == c) for c in categories}
    print(f"Wrote data.json — {len(questions)} questions across {len(categories)} categories: {per}")


if __name__ == "__main__":
    main()
