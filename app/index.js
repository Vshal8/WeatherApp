import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RootLayout from './_layout';

export default function Page() {
    return <SafeAreaView className={`flex flex-1`}>
        <Text>My First Page</Text>
    </SafeAreaView>
}