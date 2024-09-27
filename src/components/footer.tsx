import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import facebookIcon from "../../public/svg/icon-facebook.svg";
import linkedinIcon from "../../public/svg/icon-linkedin.svg";
import youtubeIcon from "../../public/svg/icon-youtube.svg";
import twitterIcon from "../../public/svg/icon-twitter.svg";

export default function Footer()  {
  return (
    <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-6">
              <h4 className="text-white text-lg font-bold mb-4">Criteria</h4>
              <div className="space-y-4">
                <p className="mb-0">
                  Efficiency and ease-of-use are our mission, simplifying the process of
                  running a sports league.
                </p>
                <p className="mb-0">
                  Badminton.io is available to all at no cost. Additionally, we offer
                  premium plans that include additional functionality.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white text-lg font-bold mb-4">About</h4>
              <div className="space-y-2">
                <Link href="/about" className="text-white hover:text-gray-400">
                  About
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white text-lg font-bold mb-4">Features</h4>
              <div className="space-y-2">
                <Link href="/league" className="text-white hover:text-gray-400">
                  League
                </Link>
                <Link href="/shop" className="text-white hover:text-gray-400">
                  Shop
                </Link>
                <Link href="/group" className="text-white hover:text-gray-400">
                  Group
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white text-lg font-bold mb-4">Badminton.io</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Link href="/terms-and-conditions" className="text-white hover:text-gray-400">
                    Terms & Conditions
                  </Link>
                  <Link href="/privacy" className="text-white hover:text-gray-400">
                    Privacy
                  </Link>
                  <Link href="/" className="text-white hover:text-gray-400">
                    Badminton.io
                  </Link>
                </div>
                <div className="flex space-x-4">
                  <Link href="" className="text-white hover:text-gray-400">
                    <Image src={linkedinIcon} alt="LinkedIn" width={30} height={31} />
                  </Link>
                  <Link href="" className="text-white hover:text-gray-400">
                    <Image src={twitterIcon} alt="Twitter" width={30} height={31} />
                  </Link>
                  <Link href="" className="text-white hover:text-gray-400">
                    <Image src={facebookIcon} alt="Facebook" width={30} height={31} />
                  </Link>
                  <Link href="" className="text-white hover:text-gray-400">
                    <Image src={youtubeIcon} alt="YouTube" width={30} height={31} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between py-4 mt-4 border-t border-gray-700 text-white">
            <p className="mb-4 sm:mb-0">© 2023 Company, Inc. All rights reserved.</p>
            <ul className="flex space-x-4">
              <li>
                <Link href="#" className="text-white hover:text-gray-400">
                  <svg className="bi" width={24} height={24}>
                    <use xlinkHref="#twitter" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-gray-400">
                  <svg className="bi" width={24} height={24}>
                    <use xlinkHref="#instagram" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-gray-400">
                  <svg className="bi" width={24} height={24}>
                    <use xlinkHref="#facebook" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
  );
};
