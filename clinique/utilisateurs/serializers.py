from rest_framework import serializers
from .models import Utilisateur, Medecin, Assistant
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name',
            'is_active', 'is_staff',
            'role'
        ]

class MedecinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medecin
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name',
            'adresse', 'numero_telephone',
            'specialite',
            'role', 'is_active'
        ]

class AssistantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assistant
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name',
            'adresse', 'numero_telephone',
            'role', 'is_active'
        ]

class InscriptionAvecRoleSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.ChoiceField(choices=[('medecin', 'Médecin'), ('assistant', 'Assistant')])
    adresse = serializers.CharField()
    numero_telephone = serializers.CharField()
    specialite = serializers.CharField(required=False)

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        role = validated_data.pop('role')
        password = validated_data.pop('password')
        specialite = validated_data.pop('specialite', '')

        if role == 'medecin':
            medecin = Medecin.objects.create(
                role='medecin',
                specialite=specialite,
                **validated_data
            )
            medecin.set_password(password)
            medecin.save()
            return medecin
        elif role == 'assistant':
            assistant = Assistant.objects.create(
                role='assistant',
                **validated_data
            )
            assistant.set_password(password)
            assistant.save()
            return assistant
        raise serializers.ValidationError("Rôle invalide.")

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['id'] = self.user.id
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['username'] = self.user.username
        return data
