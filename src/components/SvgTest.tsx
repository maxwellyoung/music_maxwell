import Image from "next/image";

export default function SvgTest() {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-2xl font-bold">SVG Test Component</h1>

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/icons/speech-bubble.svg"
            alt="Speech Bubble"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="text-sm">Speech Bubble</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Image
            src="/icons/musicnote.svg"
            alt="Music Note"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="text-sm">Music Note</span>
        </div>
      </div>
    </div>
  );
}
