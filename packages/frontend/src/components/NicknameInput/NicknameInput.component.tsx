import { NicknameInputLayout, WarningText } from "./NicknameInput.styles";

import { TextInput } from "../common/TextInput";

const NicknameInput = () => {
  return (
    <NicknameInputLayout>
      <TextInput sizeType="medium" placeholder="닉네임을 입력해주세요" />
      <WarningText>warning!</WarningText>
    </NicknameInputLayout>
  );
};

export default NicknameInput;
