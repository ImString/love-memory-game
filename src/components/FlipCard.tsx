import React, { useEffect } from 'react';
import {
	Dimensions,
	Image,
	ImageSourcePropType,
	Pressable,
	StyleSheet,
	Text,
	View
} from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';

interface FlipCardProps {
	showImage?: boolean;
	image?: ImageSourcePropType;
	onPress?: () => void;
}

export function FlipCard({ showImage = false, image, onPress }: FlipCardProps) {
	const isFlipped = useSharedValue(showImage ? 0 : 1);

	useEffect(() => {
		isFlipped.value = withTiming(showImage ? 0 : 1, { duration: 500 });
	}, [showImage]);

	const frontAnimatedStyle = useAnimatedStyle(() => {
		const rotateY = interpolate(isFlipped.value, [0, 1], [0, 180]);
		return {
			transform: [{ rotateY: `${rotateY}deg` }],
			backfaceVisibility: 'hidden'
		};
	});

	const backAnimatedStyle = useAnimatedStyle(() => {
		const rotateY = interpolate(isFlipped.value, [0, 1], [180, 360]);
		return {
			transform: [{ rotateY: `${rotateY}deg` }],
			backfaceVisibility: 'hidden'
		};
	});

	return (
		<Pressable disabled={showImage} style={styles.card} onPress={onPress}>
			{/* FACE */}
			<Animated.View style={[styles.face, frontAnimatedStyle]}>
				{image ? (
					<Image source={image} style={styles.image} resizeMode="cover" />
				) : (
					<View />
				)}
			</Animated.View>

			{/* BACK */}
			<Animated.View style={[styles.back, backAnimatedStyle]}>
				<Text style={styles.backText}>?</Text>
			</Animated.View>
		</Pressable>
	);
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING_HORIZONTAL = 0;
const CARD_MARGIN = 5;
const CARD_SIZE = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2 - CARD_MARGIN * 6) / 4;

const styles = StyleSheet.create({
	card: {
		width: CARD_SIZE,
		height: CARD_SIZE,
		margin: CARD_MARGIN
	},
	face: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: '#5A1F1F',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1
	},
	back: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: '#5A1F1F',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 8
	},
	backText: {
		color: '#fff',
		fontSize: 32,
		fontWeight: 'bold'
	}
});
