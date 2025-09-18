import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={styles.center}>
				<Image
					source={require('@/assets/images/logo.png')}
					style={styles.logo}
					resizeMode="contain"
				/>
				<Text style={styles.title}>Bem vinda</Text>
				<Text style={styles.subtitle}>Feito com amor para meu amor</Text>
			</View>
			<TouchableOpacity style={styles.button} onPress={() => router.push('/game')}>
				<Text style={styles.buttonText}>Jogar</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2c0001',
		justifyContent: 'space-between',
		paddingVertical: 60,
		paddingHorizontal: 20
	},
	center: {
		alignItems: 'center',
		marginTop: '40%'
	},
	logo: {
		width: 180,
		height: 120,
		marginBottom: 30
	},
	title: {
		fontSize: 28,
		color: '#ccc',
		fontWeight: '600',
		marginBottom: 10
	},
	subtitle: {
		fontSize: 16,
		color: '#888'
	},
	button: {
		borderWidth: 1,
		borderColor: '#ccc',
		paddingVertical: 16,
		alignItems: 'center',
		borderRadius: 8
	},
	buttonText: {
		color: '#ccc',
		fontSize: 18
	}
});
