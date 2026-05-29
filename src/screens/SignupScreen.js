import { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, ScrollView, Platform, View,
} from 'react-native';

export default function SignupScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.title}>회원가입</Text>

        <TextInput
          style={styles.input}
          placeholder="이메일 입력"
          placeholderTextColor="#BBBBBB"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="전화번호 입력"
          placeholderTextColor="#BBBBBB"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 입력"
          placeholderTextColor="#BBBBBB"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign-Up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>- OR -</Text>

        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: '#FFFFFF' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 36,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 14,
    fontSize: 15,
    color: '#333333',
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#A8D5BF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    marginTop: 24,
    marginBottom: 12,
    color: '#AAAAAA',
    fontSize: 13,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginHint: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  loginLink: {
    color: '#222222',
    fontSize: 13,
    fontWeight: '700',
  },
});
