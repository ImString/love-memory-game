import { FlipCard } from '@/components/FlipCard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CardImage = {
	id: string;
	image_id: number;
	selected: boolean;
};

type TitleColor = 'DEFAULT' | 'HIT' | 'WIN';

const titleColorMap: { [key in TitleColor]: string } = {
	DEFAULT: '#C96A6A',
	HIT: '#88C96A',
	WIN: '#FFD900'
};

const imageMap: { [key: number]: any } = {
	1: require('@/assets/images/pictures/1.jpg'),
	2: require('@/assets/images/pictures/2.jpg'),
	3: require('@/assets/images/pictures/3.jpg'),
	4: require('@/assets/images/pictures/4.jpg'),
	5: require('@/assets/images/pictures/5.jpg'),
	6: require('@/assets/images/pictures/6.jpg'),
	7: require('@/assets/images/pictures/7.jpg'),
	8: require('@/assets/images/pictures/8.jpg'),
	9: require('@/assets/images/pictures/9.jpg'),
	10: require('@/assets/images/pictures/10.jpg'),
	11: require('@/assets/images/pictures/11.jpg'),
	12: require('@/assets/images/pictures/12.jpg')
};

const errorMessages = [
	'Errou! Tente novamente',
	'Não foi dessa vez, continue tentando',
	'Tente novamente, você consegue',
	'Não desista, tente mais uma vez',
	'Continue jogando, você vai acertar',
	'Quase amor, continue tentando',
	'Você consegue, não desista',
	'Não foi dessa vez, mas você vai conseguir',
	'Vai amor, ta quase lá',
	'Você está indo bem, continue tentando'
];

export default function GameScreen() {
	const [cardImages, setCardImages] = useState<CardImage[]>([]);

	const [firstCard, setFirstCard] = useState<CardImage | null>(null);
	const [secondCard, setSecondCard] = useState<CardImage | null>(null);

	const [titleColor, setTitleColor] = useState<TitleColor>('DEFAULT');
	const [message, setMessage] = useState<string>('');

	const path = usePathname();

	const isWinning = useMemo(() => {
		return cardImages.every(card => card.selected);
	}, [cardImages]);

	const shuffleArray = (array: CardImage[]) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const generatePairs = () => {
		const selectedImages: number[] = [];
		const pairs: CardImage[] = [];

		const totalPairs = 6;

		while (selectedImages.length < totalPairs) {
			const randomImageId = Math.floor(Math.random() * Object.keys(imageMap).length) + 1;
			if (!selectedImages.includes(randomImageId)) {
				selectedImages.push(randomImageId);
				pairs.push({ id: `${randomImageId}-1`, image_id: randomImageId, selected: false });
				pairs.push({ id: `${randomImageId}-2`, image_id: randomImageId, selected: false });
			}
		}

		setCardImages(shuffleArray(pairs));
	};

	const retryGame = () => {
		setCardImages(current => current.map(card => ({ ...card, selected: false })));
		setTimeout(() => {
			setFirstCard(null);
			setSecondCard(null);
			setMessage('');
			setTitleColor('DEFAULT');

			generatePairs();
		}, 700);
	};

	const handleCardPress = (card: CardImage) => {
		if (firstCard && secondCard) return;
		if (card === firstCard || card === secondCard) return;
		if (card.selected) return;

		if (!firstCard) {
			setFirstCard(card);
		} else if (!secondCard) {
			setSecondCard(card);
		}
	};

	useEffect(() => {
		if (firstCard && secondCard) {
			if (firstCard.image_id === secondCard.image_id) {
				setCardImages(prevCards =>
					prevCards.map(card =>
						card.image_id === firstCard.image_id ? { ...card, selected: true } : card
					)
				);
				setTitleColor('HIT');
				setMessage('Acertou! Continue jogando');
			} else {
				setTitleColor('DEFAULT');
				setMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
			}

			setTimeout(() => {
				setFirstCard(null);
				setSecondCard(null);
			}, 600);
		}
	}, [firstCard, secondCard]);

	useEffect(() => {
		setFirstCard(null);
		setSecondCard(null);
		setTitleColor('DEFAULT');
		setMessage('');

		generatePairs();
	}, [path]);

	return (
		<SafeAreaView style={styles.container}>
			{isWinning ? (
				<View style={styles.titleContent}>
					<Text style={[styles.title, { color: titleColorMap['WIN'] }]}>
						Você ganhou!
					</Text>
					<Text style={styles.subtitle}>Parabéns</Text>
				</View>
			) : (
				<View style={styles.titleContent}>
					<Text style={[styles.title, { color: titleColorMap[titleColor] }]}>
						Bom jogo
					</Text>
					<Text style={styles.subtitle}>{message}</Text>
				</View>
			)}

			<View style={styles.grid}>
				{cardImages.map((cardImage, index) => (
					<FlipCard
						key={index}
						image={imageMap[cardImage.image_id]}
						showImage={
							cardImage.selected ||
							cardImage === firstCard ||
							cardImage === secondCard
						}
						onPress={() => handleCardPress(cardImage)}
					/>
				))}
			</View>

			<View style={{ height: 120 }}>
				{isWinning && (
					<TouchableOpacity style={styles.button} onPress={retryGame}>
						<FontAwesome name="refresh" size={24} color="#fff" />
						<Text style={styles.buttonText}>Jogar novamente</Text>
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2c0001',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 60,
		paddingHorizontal: 20,
		paddingBottom: 60
	},
	titleContent: {
		alignItems: 'center'
	},
	title: {
		color: '#C96A6A',
		fontSize: 28,
		fontWeight: 'bold'
	},
	subtitle: {
		textAlign: 'center',
		color: '#C0C0C0',
		fontSize: 20
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center'
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#C0C0C0',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
		marginTop: 40
	},
	buttonText: {
		color: '#C0C0C0',
		marginLeft: 8,
		fontSize: 18
	}
});
