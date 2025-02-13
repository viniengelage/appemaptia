import React, { useCallback, useRef, useState } from 'react';

import { Input } from 'components/Inputs/Default';
import { Form } from 'global/styles/global';
import { Button } from 'components/Buttons/Default';
import { FormHandles, SubmitHandler } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Yup from 'yup';

import register2image from 'assets/register2.png';

import { Mask } from 'components/Inputs/Mask';
import { Masks } from 'react-native-mask-input';
import { ISelectReference, Select } from 'components/Inputs/Select';

import { api } from 'services/api';
import dayjs from 'dayjs';
import { getValidationErrors } from '../../../utils/validation';
import { Container, Bold, Description, Image } from '../styles';

type Step2ScreenProp = StackNavigationProp<any, 'Step1'>;

interface IFormData {
  cellphone: string;
  birthday: string;
  gren: string;
}

export function Step2() {
  const formRef = useRef<FormHandles>(null);
  const selectRef = useRef<ISelectReference>(null);
  const { navigate } = useNavigation<Step2ScreenProp>();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit: SubmitHandler<IFormData> = useCallback(
    async data => {
      formRef.current?.setErrors({});
      // setLoading(true);
      const birthday = new Date();

      if (data.birthday) {
        const birthdaySplit = data.birthday.split('/');

        dayjs(
          birthday.setFullYear(
            Number(birthdaySplit[2]),
            Number(birthdaySplit[1]) - 1,
            Number(birthdaySplit[0]),
          ),
        ).toDate();
      }

      try {
        const schema = Yup.object().shape({
          cellphone: Yup.string().required(),
          birthday: Yup.date().required(),
          genre: Yup.string().required(),
        });

        await schema.validate({ ...data, birthday }, { abortEarly: false });

        await api.put('/users', {
          ...data,
          birthday,
        });

        setLoading(false);

        navigate('Step3');
      } catch (error) {
        setLoading(false);

        const errors = getValidationErrors(error);

        if (errors) {
          formRef.current?.setErrors(errors);
        }
      }
    },
    [navigate],
  );

  return (
    <Container>
      <Description>
        <Bold>Perfeito! </Bold>
        <Description>Para continuar, nos deixe saber quem você é!</Description>
      </Description>

      <Form onSubmit={handleSubmit} ref={formRef}>
        <Mask
          name="cellphone"
          placeholder="Telefone"
          icon="call-outline"
          mask={Masks.BRL_PHONE}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() =>
            formRef.current?.getFieldRef('birthday').focus()
          }
        />

        <Mask
          name="birthday"
          placeholder="Data de nascimento (DD/MM/AAAA)"
          icon="calendar-outline"
          mask={Masks.DATE_DDMMYYYY}
          keyboardType="number-pad"
          returnKeyType="next"
          onSubmitEditing={() => selectRef.current?.open()}
        />

        <Select
          ref={selectRef}
          name="genre"
          placeholder="Genero"
          options={[
            { label: 'Masculino', value: 'male' },
            { label: 'Feminino', value: 'female' },
            { label: 'Outro', value: 'other' },
          ]}
        />

        <Button
          title="Continuar"
          loading={loading}
          onPress={() => formRef.current?.submitForm()}
        />
      </Form>

      <Image
        style={{
          flex: 1,
          height: undefined,
          width: undefined,
          alignSelf: 'stretch',
        }}
        source={register2image}
        resizeMode="contain"
      />
    </Container>
  );
}
