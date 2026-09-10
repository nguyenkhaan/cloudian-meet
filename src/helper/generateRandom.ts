export function generateRandomString() {
    const getRandomLetters = (length: number) => {
        let result = '';
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < length; i++) {
            result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return result;
    };

    const part1 = getRandomLetters(3);
    const part2 = getRandomLetters(3);
    const part3 = getRandomLetters(4);

  return `${part1}-${part2}-${part3}`;
}
