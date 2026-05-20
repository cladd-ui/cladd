import {
  OTPField,
  OTPFieldInput,
  OTPFieldSeparator,
  SectionTitle,
  Surface,
} from '@cladd-ui/react';
import { useState } from 'react';

export default function OTPFieldDemo() {
  const [otp, setOtp] = useState('');
  const [otpGrouped, setOtpGrouped] = useState('');
  const [otpAlpha, setOtpAlpha] = useState('');
  return (
    <>
      <SectionTitle>OTPField</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 items-start"
        outline
        className="rounded-3xl"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">SM:</span>
          <OTPField size="sm" value={otp} onChange={setOtp}>
            <OTPFieldInput placeholder="•" />
            <OTPFieldInput placeholder="•" />
            <OTPFieldInput placeholder="•" />
            <OTPFieldInput placeholder="•" />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">MD:</span>
          <OTPField size="md" value={otp} onChange={setOtp}>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">LG:</span>
          <OTPField size="lg" value={otp} onChange={setOtp}>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">XL:</span>
          <OTPField size="xl" value={otp} onChange={setOtp}>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">2XL:</span>
          <OTPField size="2xl" value={otp} onChange={setOtp}>
            <OTPFieldInput placeholder="•" />
            <OTPFieldInput placeholder="•" />
            <OTPFieldInput placeholder="•" />
            <OTPFieldInput placeholder="•" />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">Grouped:</span>
          <OTPField size="lg" value={otpGrouped} onChange={setOtpGrouped}>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldSeparator />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
          <span className="font-mono text-xs">{otpGrouped || ' '}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">Invalid:</span>
          <OTPField size="lg" value={otp} onChange={setOtp} valid={false}>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">Disabled:</span>
          <OTPField size="lg" value="42" onChange={() => {}} disabled>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">ReadOnly:</span>
          <OTPField size="lg" value="42" onChange={() => {}} readOnly>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">Alpha:</span>
          <OTPField
            size="lg"
            pattern="[A-Za-z0-9]"
            inputMode="text"
            value={otpAlpha}
            onChange={(v) => setOtpAlpha(v.toUpperCase())}
          >
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldSeparator />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPField>
        </div>
      </Surface>
    </>
  );
}
